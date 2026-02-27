from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.config.database import get_db
from app.config.security import create_access_token, verify_token
from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse
import hashlib
import os
import base64
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Usar PBKDF2-SHA256 de Python estándar (sin dependencias externas)
# Esto evita problemas de versiones con bcrypt/argon2
HASHING_ALGORITHM = "pbkdf2_sha256"
logger.info(f"✅ Usando {HASHING_ALGORITHM} para hashing (Python stdlib, sin deps externas)")


def hash_password(password: str) -> str:
    """Hashear contraseña usando PBKDF2-SHA256 de Python estándar"""
    try:
        # Generar salt aleatorio
        salt = os.urandom(32)
        
        # Hash con PBKDF2-SHA256 (100,000 iteraciones)
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt,
            100000  # Iteraciones (balance seguridad/velocidad)
        )
        
        # Formato: algorithm$iterations$salt$hash (base64)
        hash_str = f"pbkdf2_sha256$100000${base64.b64encode(salt).decode('ascii')}${base64.b64encode(pwd_hash).decode('ascii')}"
        
        logger.debug(f"✅ Contraseña hasheada exitosamente (pbkdf2_sha256)")
        return hash_str
    except Exception as e:
        logger.error(f"❌ Error al hashear contraseña: {str(e)}", exc_info=True)
        raise ValueError(f"Error al procesar contraseña: {str(e)}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña contra hash PBKDF2"""
    try:
        # Parsear el hash almacenado
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != 'pbkdf2_sha256':
            logger.error(f"❌ Formato de hash inválido")
            return False
        
        algorithm, iterations, salt_b64, stored_hash_b64 = parts
        
        # Decodificar salt
        salt = base64.b64decode(salt_b64.encode('ascii'))
        
        # Calcular hash de la contraseña ingresada
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt,
            int(iterations)
        )
        
        # Comparar hashes
        computed_hash_b64 = base64.b64encode(pwd_hash).decode('ascii')
        result = computed_hash_b64 == stored_hash_b64
        
        if result:
            logger.debug(f"✅ Contraseña verificada exitosamente")
        else:
            logger.debug(f"❌ Contraseña incorrecta")
        
        return result
    except Exception as e:
        logger.error(f"❌ Error al verificar contraseña: {str(e)}", exc_info=True)
        return False


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    try:
        logger.info(f"📝 Intentando registrar usuario: email={user.email}, username={user.username}")
        
        # Verificar si usuario existe
        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            logger.warning(f"⚠️ Email ya registrado: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este email ya está registrado"
            )
        
        existing_username = db.query(User).filter(User.username == user.username).first()
        if existing_username:
            logger.warning(f"⚠️ Username ya registrado: {user.username}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este nombre de usuario ya está en uso"
            )
        
        # Crear usuario
        hashed_password = hash_password(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            password_hash=hashed_password
        )
        
        logger.info(f"📝 Agregando usuario a la BD...")
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"✅ Usuario registrado exitosamente en BD: {user.email} (id={db_user.id})")
        
        # Crear token
        logger.info(f"🔐 Creando token de acceso...")
        access_token = create_access_token(data={"sub": str(db_user.id)})
        logger.info(f"✅ Token creado exitosamente")
        
        # Serializar respuesta
        logger.info(f"📦 Serializando respuesta del usuario...")
        user_response = UserResponse.from_orm(db_user)
        logger.info(f"✅ Respuesta serializada exitosamente")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }
    except HTTPException as he:
        logger.error(f"❌ HTTPException en registro: {he.detail}")
        raise
    except ValueError as ve:
        logger.error(f"❌ ValueError en registro: {str(ve)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Datos inválidos: {str(ve)}"
        )
    except Exception as e:
        logger.error(f"❌ Error inesperado al registrar usuario: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar usuario"
        )


class LoginRequest(BaseModel):
    """Schema para login"""
    email: str
    password: str


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login de usuario"""
    try:
        logger.info(f"🔐 Intento de login: {request.email}")
        
        # Buscar usuario
        db_user = db.query(User).filter(User.email == request.email).first()
        
        if not db_user:
            logger.warning(f"⚠️ Usuario no encontrado: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        # Verificar es_active
        if not db_user.is_active:
            logger.warning(f"⚠️ Usuario inactivo: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario desactivado"
            )
        
        # Verificar contraseña
        if not verify_password(request.password, db_user.password_hash):
            logger.warning(f"⚠️ Contraseña incorrecta: {request.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        
        # Crear token
        logger.info(f"🔐 Generando token para: {request.email}")
        access_token = create_access_token(data={"sub": str(db_user.id)})
        logger.info(f"✅ Login exitoso: {request.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": UserResponse.from_orm(db_user)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error en login: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error en login"
        )


@router.get("/me", response_model=UserResponse)
def get_current_user(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Obtener usuario actual"""
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return user


@router.post("/logout")
def logout():
    """Cerrar sesión (JWT stateless)."""
    return {
        "message": "Sesión cerrada correctamente"
    }

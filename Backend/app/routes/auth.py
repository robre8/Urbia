from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.config.database import get_db
from app.config.security import create_access_token, verify_token
from app.models.models import User
from app.schemas.schemas import UserCreate, UserResponse
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Detectar qué algoritmo de hashing está disponible
def _detect_hashing_algorithm():
    """Detectar qué backend de password hashing está disponible"""
    # Intentar argon2 primero (más seguro)
    try:
        import argon2
        logger.info("✅ Argon2 disponible - usando como algoritmo principal")
        return "argon2", CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")
    except ImportError:
        pass
    
    # Fallback a bcrypt (siempre disponible con passlib[bcrypt])
    try:
        logger.info("✅ Usando bcrypt - Argon2 no disponible")
        return "bcrypt", CryptContext(schemes=["bcrypt"], deprecated="auto")
    except Exception as e:
        logger.critical(f"❌ CRITICAL: Ni bcrypt ni argon2 disponibles: {e}")
        raise RuntimeError("No password hashing backend available!")

HASHING_ALGORITHM, pwd_context = _detect_hashing_algorithm()


def hash_password(password: str) -> str:
    """Hashear contraseña - intenta el algoritmo detectado, fallback si es necesario"""
    global HASHING_ALGORITHM, pwd_context
    
    try:
        # Si usamos bcrypt como fallback, truncar a 72 bytes si es necesario
        if HASHING_ALGORITHM == "bcrypt":
            password_bytes = password.encode('utf-8')[:72]
            password = password_bytes.decode('utf-8', errors='ignore')
        
        hashed = pwd_context.hash(password)
        logger.debug(f"✅ Contraseña hasheada exitosamente ({HASHING_ALGORITHM})")
        return hashed
    except Exception as e:
        logger.error(f"❌ Error hashing con {HASHING_ALGORITHM}: {str(e)}", exc_info=True)
        
        # Si fallamos y estábamos usando argon2, intentar con bcrypt como último recurso
        if HASHING_ALGORITHM == "argon2":
            logger.warning(f"⚠️ Argon2 falló, intentando fallback a bcrypt")
            try:
                pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
                HASHING_ALGORITHM = "bcrypt"
                password_bytes = password.encode('utf-8')[:72]
                password = password_bytes.decode('utf-8', errors='ignore')
                hashed = pwd_context.hash(password)
                logger.info(f"✅ Fallback a bcrypt exitoso")
                return hashed
            except Exception as e2:
                logger.error(f"❌ También falló bcrypt: {str(e2)}", exc_info=True)
                raise ValueError(f"Error crítico al procesar contraseña: {str(e2)}")
        else:
            raise ValueError(f"Error al procesar contraseña: {str(e)}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña"""
    try:
        result = pwd_context.verify(plain_password, hashed_password)
        if result:
            logger.debug(f"✅ Contraseña verificada exitosamente")
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

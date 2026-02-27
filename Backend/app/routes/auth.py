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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hashear contraseña
    
    Bcrypt solo puede hashear hasta 72 bytes.
    Si la contraseña en UTF-8 excede 72 bytes, se trunca.
    """
    # Convertir a bytes UTF-8 y truncar a 72 bytes máximo
    password_bytes = password.encode('utf-8')[:72]
    # Convertir de vuelta a string para passlib
    password_truncated = password_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(password_truncated)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña"""
    return pwd_context.verify(plain_password, hashed_password)


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
    # Buscar usuario
    db_user = db.query(User).filter(User.email == request.email).first()
    
    if not db_user or not verify_password(request.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # Crear token
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(db_user)
    }


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

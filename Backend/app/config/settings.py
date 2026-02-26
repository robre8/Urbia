import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    
    # Base de datos
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost/urbia"
    )
    
    # JWT
    jwt_secret_key: str = os.getenv("JWT_SECRET", "tu_secreto_super_seguro")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # AWS S3
    s3_bucket_name: str = os.getenv("S3_BUCKET_NAME", "urbia-imagenes")
    aws_access_key_id: str = os.getenv("S3_KEY", "")
    aws_secret_access_key: str = os.getenv("S3_SECRETKEY", "")
    aws_region: str = "us-east-2"
    
    # Google Cloud
    gcp_bucket_name: str = os.getenv("GCP_BUCKET_NAME", "bucket-urbia")
    
    # Gemini API
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_api_url: str = "https://generativelanguage.googleapis.com"
    
    # CORS
    cors_allowed_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "*"
    ]
    
    # App
    app_title: str = "Urbia API"
    app_version: str = "0.0.1"
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Obtener instancia de Settings en caché"""
    return Settings()

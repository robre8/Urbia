import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    
    # Base de datos
    database_url: str = "postgresql://user:password@localhost/urbia"
    
    # JWT - Nombre debe coincidir con render.yaml (JWT_SECRET)
    jwt_secret: str = "tu_secreto_super_seguro"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # Cloudinary - Reemplaza AWS S3 (formato: cloudinary://api_key:api_secret@cloud_name)
    cloudinary_url: str = ""
    
    # Google Cloud
    gcp_bucket_name: str = "bucket-urbia"
    
    # Gemini API
    gemini_api_key: str = ""
    gemini_api_url: str = "https://generativelanguage.googleapis.com"
    
    # CORS
    cors_allowed_origins: str = "*"
    
    # App
    app_title: str = "Urbia API"
    app_version: str = "0.0.5-categories"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = 'allow'  # Permitir campos extra del .env


@lru_cache()
def get_settings() -> Settings:
    """Obtener instancia de Settings en caché"""
    return Settings()

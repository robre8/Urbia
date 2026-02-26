import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configuración de la aplicación"""
    
    # Base de datos
    database_url: str = "postgresql://user:password@localhost/urbia"
    
    # JWT
    jwt_secret_key: str = "tu_secreto_super_seguro"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    
    # AWS S3
    s3_bucket_name: str = "urbia-imagenes"
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-2"
    
    # Google Cloud
    gcp_bucket_name: str = "bucket-urbia"
    
    # Gemini API
    gemini_api_key: str = ""
    gemini_api_url: str = "https://generativelanguage.googleapis.com"
    
    # CORS
    cors_allowed_origins: str = "http://localhost:3000,http://localhost:5173"
    
    # App
    app_title: str = "Urbia API"
    app_version: str = "0.0.1"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = 'allow'  # Permitir campos extra del .env


@lru_cache()
def get_settings() -> Settings:
    """Obtener instancia de Settings en caché"""
    return Settings()

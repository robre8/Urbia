"""
Archivo de configuración para pytest en tests
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

# Configurar base de datos de prueba
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    TEST_SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Fixture para proporcionar una sesión de BD en tests"""
    from app.config.database import Base
    
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

"""
Tests para el módulo de autenticación
"""

import pytest
from fastapi.testclient import TestClient
from app.config.database import Base
from main import app
from app.routes.auth import hash_password


client = TestClient(app)


def test_register_user():
    """Test de registro de usuario"""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpassword123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"
    assert data["is_active"] is True


def test_register_duplicate_email():
    """Test de registro con email duplicado"""
    # Registrar primer usuario
    client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@example.com",
            "username": "user1",
            "password": "password123"
        }
    )
    
    # Intentar registrar con mismo email
    response = client.post(
        "/api/auth/register",
        json={
            "email": "duplicate@example.com",
            "username": "user2",
            "password": "password123"
        }
    )
    
    assert response.status_code == 400
    assert "ya existe" in response.json()["detail"]


def test_login():
    """Test de login"""
    # Registrar usuario
    client.post(
        "/api/auth/register",
        json={
            "email": "login@example.com",
            "username": "loginuser",
            "password": "password123"
        }
    )
    
    # Login
    response = client.post(
        "/api/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password():
    """Test de login con contraseña incorrecta"""
    # Registrar usuario
    client.post(
        "/api/auth/register",
        json={
            "email": "wrong@example.com",
            "username": "wronguser",
            "password": "password123"
        }
    )
    
    # Login con contraseña incorrecta
    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }
    )
    
    assert response.status_code == 401

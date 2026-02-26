"""
Tests para el módulo de categorías
"""

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_categories():
    """Test de obtener categorías"""
    response = client.get("/api/categories")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_create_category():
    """Test de crear categoría"""
    response = client.post(
        "/api/categories",
        json={
            "name": "Test Category",
            "description": "Una categoría de prueba",
            "color": "#FF0000",
            "icon": "🧪"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Category"

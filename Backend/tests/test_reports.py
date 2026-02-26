"""
Tests para el módulo de reportes
"""

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_get_reports():
    """Test de obtener reportes"""
    response = client.get("/api/reports")
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_reports_by_category():
    """Test de obtener reportes filtrados por categoría"""
    response = client.get("/api/reports?category=Baches")
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)

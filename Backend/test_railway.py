#!/usr/bin/env python3
"""
Script para probar el endpoint de registro en Railway
"""
import requests
import json
from datetime import datetime

# URL de Railway
BASE_URL = "https://urbia-production.up.railway.app"

def test_health():
    """Probar endpoint de health"""
    print("\n🔍 Verificando Railway deployment...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Railway está ONLINE")
            print(f"  App: {data.get('app')}")
            print(f"  Version: {data.get('version')}")
            print(f"  CORS: {data.get('cors_configured')}")
            return True
        else:
            print(f"❌ Health check falló: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error conectando a Railway: {e}")
        return False

def test_register():
    """Probar endpoint de registro"""
    # Usuario único con timestamp
    timestamp = datetime.now().strftime("%H%M%S")
    user_data = {
        "username": f"test_{timestamp}",
        "email": f"test_{timestamp}@example.com",
        "password": "contraseña123"  # Con ñ para probar UTF-8
    }
    
    print(f"\n📝 Probando registro en Railway...")
    print(f"  Email: {user_data['email']}")
    print(f"  Password: {user_data['password']}")
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n🎉 REGISTRO EXITOSO EN RAILWAY!")
            print(f"  User ID: {data['user']['id']}")
            print(f"  Username: {data['user']['username']}")
            print(f"  Email: {data['user']['email']}")
            print(f"  Token recibido: {'access_token' in data}")
            print(f"\n✅✅✅ EL FIX FUNCIONA EN RAILWAY ✅✅✅")
            return True
        else:
            print(f"\n❌ REGISTRO FALLÓ")
            print(f"  Status: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"\n❌ Error en registro: {e}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("PRUEBA DE RAILWAY - Endpoint de Registro")
    print("="*60)
    
    # Test 1: Health
    health_ok = test_health()
    
    if health_ok:
        # Test 2: Register
        register_ok = test_register()
        
        if register_ok:
            print("\n" + "="*60)
            print("✅ TODOS LOS TESTS PASARON")
            print("="*60)
        else:
            print("\n" + "="*60)
            print("❌ REGISTRO FALLÓ - Revisar logs de Railway")
            print("="*60)
    else:
        print("\n" + "="*60)
        print("❌ Railway no está respondiendo")
        print("="*60)

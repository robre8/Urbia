# ✅ Guía de Validación Post-Migración

## 📋 Checklist Complet

### 1. Estructura de Archivos

- ✅ `Backend/main.py` existe
- ✅ `Backend/requirements.txt` existe
- ✅ `Backend/app/` directory structure está completo
- ✅ `Backend/tests/` directory existe
- ✅ `Dockerfile` actualizado para Python
- ✅ `render.yaml` actualizado para Python

### 2. Instalación y Dependencias

```bash
# Verificar Python version
python --version  # Debe ser 3.11+

# Crear virtual environment
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación exitosa
pip list | grep -E "fastapi|sqlalchemy|pydantic"
```

### 3. Configuración de Entorno

```bash
cd Backend

# Crear archivo .env
cp .env.example .env

# Verificar que contiene:
# - DATABASE_URL (PostgreSQL)
# - JWT_SECRET
# - S3_KEY y S3_SECRETKEY
# - GEMINI_API_KEY
# - Otros valores
```

### 4. Base de Datos

```bash
# Opción A: PostgreSQL local
psql postgres
CREATE DATABASE urbia;
CREATE USER urbia_user WITH PASSWORD 'password';
ALTER DATABASE urbia OWNER TO urbia_user;

# Opción B: Docker
docker run --name urbia-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=urbia \
  -p 5432:5432 \
  -d postgres:15

# Verificar conexión
python -c "from app.config.database import engine; engine.connect()"
```

### 5. Inicializar Datos de Ejemplo

```bash
python init_db.py
# Debe mostrar: ✅ Base de datos inicializada correctamente
```

### 6. Ejecutar Servidor

```bash
cd Backend
uvicorn main:app --reload

# Output esperado:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

### 7. Probar Endpoints

```bash
# En otra terminal...

# Health check
curl http://localhost:8000/health
# Respuesta: {"status":"healthy","app":"Urbia API","version":"0.0.1"}

# Root endpoint
curl http://localhost:8000/
# Respuesta: {"message":"Bienvenido a Urbia API",...}

# Listar categorías
curl http://localhost:8000/api/categories
# Respuesta: [{"id":1,"name":"Baches",...}]

# Listar reportes
curl http://localhost:8000/api/reports
# Respuesta: []

# Registrar usuario
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
# Respuesta: {"id":1,"email":"test@example.com","username":"testuser",...}
```

### 8. Probar Documentación Automática

```
# Swagger UI
http://localhost:8000/docs

# ReDoc
http://localhost:8000/redoc

# OpenAPI JSON
http://localhost:8000/openapi.json
```

### 9. Ejecutar Tests

```bash
# Instalar pytest (ya está en requirements.txt)
pip install pytest

# Ejecutar todos los tests
pytest

# Ejecutar tests específicos
pytest tests/test_auth.py
pytest tests/test_reports.py
pytest tests/test_categories.py

# Ejecutar con verbose
pytest -v

# Ejecutar con cobertura
pip install pytest-cov
pytest --cov=app
```

### 10. Verificar Estructura del Código

```bash
# Verificar que no hay errores de sintaxis
python -m py_compile app/main.py
python -m py_compile app/models/models.py
python -m py_compile app/routes/auth.py
python -m py_compile app/routes/reports.py
python -m py_compile app/routes/categories.py

# Instalar y ejecutar linter (opcional)
pip install flake8
flake8 .
```

### 11. Docker Build

```bash
# Compilar imagen Docker
docker build -f Backend/Dockerfile -t urbia-api:latest .

# Ejecutar contenedor
docker run -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/urbia \
  -e JWT_SECRET=test \
  urbia-api:latest

# Verificar que funciona
curl http://localhost:8000/health
```

---

## 🔍 Validación de Funcionalidades Clave

### 1. Autenticación JWT

```bash
# Registrar usuario
REGISTER=$(curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "username": "testuser",
    "password": "secure123"
  }')

# Login
LOGIN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "secure123"
  }')

# Extraer token
TOKEN=$(echo $LOGIN | jq -r '.access_token')

# Usar token
curl -s http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 2. CRUD de Reportes

```bash
# Crear reporte (requiere auth)
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bache en Calle Principal",
    "description": "Gran bache",
    "category": "Baches",
    "latitude": -34.603,
    "longitude": -58.381
  }'

# Listar reportes
curl http://localhost:8000/api/reports

# Listar por categoría
curl "http://localhost:8000/api/reports?category=Baches"

# Obtener reporte específico
curl http://localhost:8000/api/reports/1
```

### 3. Categorías

```bash
# Listar categorías
curl http://localhost:8000/api/categories

# Obtener categoría
curl http://localhost:8000/api/categories/1

# Crear categoría
curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "description": "Categoría test",
    "color": "#FF0000"
  }'
```

---

## 🐛 Troubleshooting

### Error: "No module named 'app'"

```bash
# Asegurar que virtual env está activado
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "database connection failed"

```bash
# Verificar DATABASE_URL en .env
cat .env | grep DATABASE_URL

# Verificar que PostgreSQL esté corriendo
psql -U postgres -d urbia -c "SELECT 1;"

# Si Docker:
docker ps | grep urbia-db
docker logs urbia-db
```

### Error: "ModuleNotFoundError"

```bash
# Limpiar caché de Python
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Reinstalar todo
pip install --upgrade -r requirements.txt
```

### Puerto 8000 ya está en uso

```bash
# Cambiar puerto
uvicorn main:app --reload --port 8001

# O encontrar y matar el proceso
lsof -i :8000
kill -9 <PID>
```

---

## ✅ Checklist de Validación Final

- [ ] Python 3.11+ instalado
- [ ] Virtual environment creado y activado
- [ ] requirements.txt instalado sin errores
- [ ] .env configurado con valores reales
- [ ] PostgreSQL instalado y corriendo
- [ ] init_db.py executeado exitosamente
- [ ] Servidor uvicorn inicia sin errores
- [ ] `/health` endpoint responde
- [ ] `/docs` (Swagger) accesible
- [ ] Registro de usuario funciona
- [ ] Login funciona y retorna JWT
- [ ] Endpoints de reportes funcionan
- [ ] Endpoints de categorías funcionan
- [ ] Tests pasan (`pytest`)
- [ ] Docker image compila exitosamente
- [ ] No hay errores de linting (`flake8`)

---

## 📞 Validación en Equipo

Compartir con el equipo:

1. **Backend debe estar corriendo** en `http://localhost:8000`
2. **Documentación API** en `http://localhost:8000/docs`
3. **Tests deben pasar** sin errores
4. **Todos los endpoints** deben responder correctamente
5. **Frontend debe poder conectar** (CORS habilitado)

---

## 🚀 Cuando Todo Funciona

Si todas las pruebas pasaron:

1. ✅ Migrations es exitosa
2. ✅ Código está listo para producción
3. ✅ Pueden proceder a desplegar en Render
4. ✅ Frontend puede conectarse sin problemas

¡**Migración validada exitosamente!** 🎉

---

**Fecha de validación:** 25 de febrero de 2025

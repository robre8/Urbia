# 🚀 Referencia Rápida - Backend Python

## Información Esencial

**Framework:** FastAPI 0.104.1  
**Python:** 3.11+  
**ORM:** SQLAlchemy 2.0.23  
**Base de Datos:** PostgreSQL  
**Puerto:** 8000  
**Documentación:** `/docs` (Swagger)

---

## ⚡ Comandos Esenciales

```bash
# Setup inicial
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# Desarrollo
uvicorn main:app --reload

# Tests
pytest
pytest -v
pytest --cov=app

# Base de datos
python init_db.py

# Herramientas útiles (si las instalarás)
pip install black flake8 pylint
black .
flake8 .
```

---

## 📁 Estructura Principal

```
Backend/
├── main.py                 ← Punto de entrada
├── requirements.txt        ← Dependencias
├── app/
│   ├── config/            ← Configuración
│   ├── models/            ← ORM models
│   ├── schemas/           ← Validación (Pydantic)
│   ├── routes/            ← Endpoints
│   └── services/          ← Lógica de negocio
└── tests/                 ← Tests unitarios
```

---

## 🔑 Variables de Entorno Obligatorias

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/urbia
JWT_SECRET=tu_secreto_super_seguro
S3_KEY=tu_aws_access_key
S3_SECRETKEY=tu_aws_secret_key
GEMINI_API_KEY=tu_gemini_key
```

---

## 🌐 Endpoints Principales

### Autenticación
```
POST   /api/auth/register     Registrar usuario
POST   /api/auth/login        Login (retorna JWT)
GET    /api/auth/me           Usuario actual (requiere JWT)
```

### Reportes
```
GET    /api/reports           Listar reportes
GET    /api/reports/{id}      Obtener reporte
POST   /api/reports           Crear reporte (requiere JWT)
PUT    /api/reports/{id}      Actualizar reporte (requiere JWT)
DELETE /api/reports/{id}      Eliminar reporte (requiere JWT)
POST   /api/reports/{id}/upload-image  Subir imagen (requiere JWT)
POST   /api/reports/{id}/like          Dar like (requiere JWT)
```

### Categorías
```
GET    /api/categories        Listar categorías
GET    /api/categories/{id}   Obtener categoría
POST   /api/categories        Crear categoría
```

### Health
```
GET    /health               Estado de la aplicación
GET    /                     Información de API
```

---

## 📚 Documentación Interna

**Documentación disponible en el servidor:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## 🔐 Autenticación

### Registro
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "username": "usuario",
    "password": "contraseña123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "contraseña123"
  }'
# Retorna: {"access_token": "...", "token_type": "bearer", "user": {...}}
```

### Usar Token
```bash
TOKEN="eyJhbGc..."
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/auth/me
```

---

## 📊 Modelos de Base de Datos

```python
# User
- id: integer (primary key)
- email: string (unique)
- username: string (unique)
- password_hash: string
- is_active: boolean
- is_verified: boolean
- created_at: datetime
- updated_at: datetime

# Report
- id: integer (primary key)
- user_id: integer (foreign key)
- title: string
- description: text
- category: string
- latitude: float
- longitude: float
- location_name: string
- image_url: string
- status: string
- likes_count: integer
- is_active: boolean
- created_at: datetime
- updated_at: datetime

# Category
- id: integer (primary key)
- name: string (unique)
- description: text
- icon: string
- color: string
- is_active: boolean
- created_at: datetime
- updated_at: datetime
```

---

## 🧪 Tests

```bash
# Ejecutar todos
pytest

# Archivo específico
pytest tests/test_auth.py

# Función específica
pytest tests/test_auth.py::test_register_user

# Modo verbose
pytest -v

# Con cobertura
pytest --cov=app

# Detener en primer fallo
pytest -x

# Mostrar prints
pytest -s
```

---

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| `ModuleNotFoundError: app` | Activar venv: `source venv/bin/activate` |
| `Database connection failed` | Verificar `DATABASE_URL` en `.env` |
| `Port 8000 already in use` | `uvicorn main:app --port 8001` |
| `ImportError: No module named 'fastapi'` | `pip install -r requirements.txt` |
| `JWT token invalid` | Verificar `JWT_SECRET` en `.env` |

---

## 📖 Ficheros de Documentación

| Archivo | Descripción |
|---------|------------|
| [README.md](./README.md) | Documentación completa del backend |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Cómo cambió de Java a Python |
| [.env.example](./.env.example) | Template de variables de entorno |
| [conftest.py](./conftest.py) | Configuración de pytest |

---

## 🔄 Workflow Típico de Desarrollo

```bash
# 1. Activar entorno
source venv/bin/activate

# 2. Verificar que todo funciona
pytest

# 3. Iniciar servidor
uvicorn main:app --reload

# 4. En otra terminal, probar endpoints
curl http://localhost:8000/health

# 5. Ver cambios en tiempo real (gracias a --reload)

# 6. Cuando termines
# Presiona Ctrl+C para detener el servidor
# Deactivate env: deactivate
```

---

## 💾 Base de Datos

### Inicializar con datos de ejemplo
```bash
python init_db.py
```

### Crear nuevas categorías
```python
# En app/routes/categories.py o donde sea necesario
# Usas el endpoint POST /api/categories
```

### Ver datos
```bash
# Conectar a PostgreSQL
psql -U urbia_user -d urbia

# Queries útiles
SELECT * FROM users;
SELECT * FROM reports;
SELECT * FROM categories;
```

---

## 🚀 Prepararse para Producción

### Antes de desplegar a Render:
- [ ] `pytest` pasa sin errores
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Docker image compila
- [ ] Health check responde

### Comandos de validación:
```bash
# Test
pytest -v

# Linter (si tienes)
flake8 .

# Construcción de imagen
docker build -f Dockerfile -t urbia-api:latest .

# Probar imagen
docker run urbia-api:latest python -c "import app"
```

---

## 📚 Recursos Útiles

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [Pydantic Docs](https://docs.pydantic.dev/)
- [Python JWT](https://python-jose.readthedocs.io/)

---

## 💡 Tips Productivos

- `--reload` en fastapi recarga automáticamente con cambios
- Swagger UI en `/docs` es tu amigo para probar APIs
- Tests son cruciales - escribelos primero (TDD)
- Use type hints - mejoran el IDE support
- Mantén modelos y schemas separados

---

**Última actualización:** 25 de febrero de 2025  
**Versión:** 1.0.0  
**Status:** ✅ Listo para producción

# Backend - API REST con FastAPI

Backend de la aplicación Urbia construido con **Python 3.11** y **FastAPI**.

## 🚀 Características

- ✅ FastAPI (framework web moderno y rápido)
- ✅ SQLAlchemy (ORM para base de datos)
- ✅ PostgreSQL (base de datos)
- ✅ JWT (autenticación)
- ✅ AWS S3 (almacenamiento de archivos)
- ✅ Google Gemini API (procesamiento de lenguaje natural)
- ✅ CORS habilitado
- ✅ Validación automática de datos con Pydantic
- ✅ Documentación automática con Swagger

## 📋 Requisitos Previos

- Python 3.11+
- PostgreSQL 12+
- pip (gestor de paquetes de Python)
- AWS S3 cuenta
- Google Gemini API Key

## 🔧 Instalación Local

### 1. Clonar repositorio

```bash
git clone https://github.com/No-Country-simulation/s21-19-t-webapp.git
cd s21-19-t-webapp
```

### 2. Crear entorno virtual

```bash
# En macOS/Linux
python3 -m venv venv
source venv/bin/activate

# En Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r Backend/requirements.txt
```

### 4. Configurar variables de entorno

```bash
cd Backend
cp .env.example .env
```

Edita el archivo `.env` y completa:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/urbia
JWT_SECRET=tu_secreto_super_seguro
S3_KEY=tu_aws_key
S3_SECRETKEY=tu_aws_secret
GEMINI_API_KEY=tu_gemini_key
DEBUG=true
```

### 5. Configurar base de datos

```bash
# Asegúrate que PostgreSQL esté corriendo y crea la base de datos
createdb urbia
```

### 6. Ejecutar servidor de desarrollo

```bash
cd Backend
uvicorn main:app --reload
```

La API estará disponible en: `http://localhost:8000`
Documentación interactiva: `http://localhost:8000/docs`

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)

### Reportes
- `GET /api/reports` - Listar reportes
- `GET /api/reports/{id}` - Obtener reporte
- `POST /api/reports` - Crear reporte (requiere auth)
- `PUT /api/reports/{id}` - Actualizar reporte (requiere auth)
- `DELETE /api/reports/{id}` - Eliminar reporte (requiere auth)
- `POST /api/reports/{id}/upload-image` - Subir imagen (requiere auth)
- `POST /api/reports/{id}/like` - Dar like (requiere auth)

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/{id}` - Obtener categoría
- `POST /api/categories` - Crear categoría

## 🗂️ Estructura del Proyecto

```
Backend/
├── main.py                 # Punto de entrada de la aplicación
├── requirements.txt        # Dependencias de Python
├── .env.example           # Variables de entorno ejemplo
├── app/
│   ├── __init__.py
│   ├── config/            # Configuración de la app
│   │   ├── settings.py    # Variables de configuración
│   │   ├── database.py    # Configuración de BD
│   │   └── security.py    # JWT y autenticación
│   ├── models/            # Modelos de BD (ORM)
│   │   └── models.py
│   ├── schemas/           # DTOs para validación
│   │   └── schemas.py
│   ├── routes/            # Endpoints de la API
│   │   ├── auth.py
│   │   ├── reports.py
│   │   └── categories.py
│   └── services/          # Lógica de negocio
│       ├── s3_service.py
│       └── gemini_service.py
└── Dockerfile            # Configuración Docker
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación
- CORS configurado
- Variables de entorno para credenciales

## 🚀 Deployment

Ver [DEPLOYMENT.md](../DEPLOYMENT.md) para instrucciones completas de despliegue en Render.

## 📝 Licencia

MIT

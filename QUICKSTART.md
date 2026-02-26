# Quick Start Guide - Development

## 🚀 Desarrollo Local

### Backend (Python + FastAPI)

```bash
# 1. Navegar al directorio del backend
cd Backend

# 2. Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# 3. Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env

# 4. Editar .env con tus credenciales reales
# - GEMINI_API_KEY: Obtener en https://makersuite.google.com/app/apikey
# - S3_KEY y S3_SECRETKEY: Credenciales de AWS
# - DATABASE_URL: Configurar PostgreSQL local

# 5. Instalar dependencias
pip install -r requirements.txt

# 6. Iniciar PostgreSQL local (Docker recomendado)
docker run --name urbia-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=urbia_db -p 5432:5432 -d postgres:15

# 7. Ejecutar el backend
uvicorn main:app --reload

# Backend disponible en: http://localhost:8000
# API documentada en: http://localhost:8000/docs
# Alternativa OpenAPI: http://localhost:8000/redoc
```

### Frontend (React + Vite)

```bash
# 1. Navegar al directorio del frontend
cd Frontend

# 2. Copiar el archivo de ejemplo
cp .env.example .env.local

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev

# Frontend disponible en: http://localhost:5173
```

---

## 🌐 Producción

**Frontend**: Desplegado en Vercel  
**Backend**: Desplegado en Render  
**Database**: PostgreSQL en Render

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas de despliegue.

---

## 📚 Documentación

- [Guía de Despliegue](./DEPLOYMENT.md) - Instrucciones paso a paso para Render y Vercel
- [Frontend README](./Frontend/README.md) - Documentación del frontend
- [Backend README](./Backend/README.md) - Documentación del backend
- [README Principal](./README.md) - Información general del proyecto

---

## 🔑 Variables de Entorno Requeridas

### Backend
- `GEMINI_API_KEY` ⚠️ **Obligatorio**
- `S3_KEY` ⚠️ **Obligatorio**
- `S3_SECRETKEY` ⚠️ **Obligatorio**
- `DATABASE_URL`
- `JWT_SECRET`

### Frontend
- `VITE_API_URL` (URL del backend)

---

## ⚡ Scripts Útiles

### Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servidor de desarrollo
uvicorn main:app --reload

# Ejecutar tests
pytest

# Ejecutar tests con coverage
pytest --cov=app

# Formatear código
black .

# Linter
flake8 .

# Inicializar base de datos con datos de ejemplo
python init_db.py
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## 🐛 Troubleshooting

### Backend no arranca
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que Python 3.11+ esté instalado
- Verificar que virtual environment esté activado
- Revisar logs en la consola

### Frontend no conecta al backend
- Verificar `VITE_API_URL` en `.env.local`
- Verificar que backend esté corriendo en puerto 8000
- Revisar CORS en `app/config/settings.py`

### Problemas con S3
- Verificar que el bucket existe
- Verificar permisos del bucket
- Verificar credenciales AWS

---

**¡Buena suerte con el desarrollo!** 🎉

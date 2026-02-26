# Quick Start Guide - Development

## 🚀 Desarrollo Local

### Backend (Java Spring Boot)

```bash
# 1. Navegar al directorio del backend
cd Backend

# 2. Copiar el archivo de ejemplo de variables de entorno
cp .env.example .env

# 3. Editar .env con tus credenciales reales
# - GEMINI_API_KEY: Obtener en https://makersuite.google.com/app/apikey
# - S3_KEY y S3_SECRETKEY: Credenciales de AWS
# - Database: Configurar PostgreSQL local

# 4. Iniciar PostgreSQL local (Docker recomendado)
docker run --name urbia-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=urbia_db -p 5432:5432 -d postgres:15

# 5. Ejecutar el backend
./mvnw spring-boot:run

# Backend disponible en: http://localhost:8080
# API disponible en: http://localhost:8080/api
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
- `FINAL_JDBC_DATABASE_URL`
- `FINAL_JDBC_DATABASE_USERNAME`
- `FINAL_JDBC_DATABASE_PASSWORD`

### Frontend
- `VITE_API_URL` (URL del backend)

---

## ⚡ Scripts Útiles

### Backend
```bash
# Limpiar y compilar
./mvnw clean install

# Ejecutar tests
./mvnw test

# Empaquetar JAR
./mvnw package
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
- Revisar logs: `./mvnw spring-boot:run`

### Frontend no conecta al backend
- Verificar `VITE_API_URL` en `.env.local`
- Verificar que backend esté corriendo en puerto 8080
- Revisar CORS en backend

### Problemas con S3
- Verificar que el bucket existe
- Verificar permisos del bucket
- Verificar credenciales AWS

---

**¡Buena suerte con el desarrollo!** 🎉

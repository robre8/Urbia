# 🚀 Guía de Despliegue - Ciudad Escucha (Urbia)

## 📋 Resumen

Este proyecto se despliega en:
- **Backend (Java Spring Boot)**: Render.com
- **Frontend (React + Vite)**: Vercel
- **Base de datos**: PostgreSQL en Render

---

## 🔧 Backend - Despliegue en Render

### Prerequisitos
1. Cuenta en [Render.com](https://render.com)
2. **AWS S3 Bucket** configurado (para almacenar imágenes/audio)
3. **Gemini API Key** de Google Cloud
4. Repositorio conectado a Render

### Pasos de Despliegue

#### 1. Crear servicio desde `render.yaml`
```bash
# En Render Dashboard:
1. New → Blueprint
2. Conectar tu repositorio GitHub (robre8/Urbia)
3. Seleccionar rama: dev
4. Render detectará automáticamente render.yaml
```

#### 2. Configurar Variables de Entorno

En Render Dashboard → Backend Service → Environment:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `FINAL_JDBC_DATABASE_URL` | Auto | Se genera automáticamente desde PostgreSQL |
| `FINAL_JDBC_DATABASE_USERNAME` | Auto | Se genera automáticamente |
| `FINAL_JDBC_DATABASE_PASSWORD` | Auto | Se genera automáticamente |
| `S3_KEY` | **Tu AWS Access Key** | Credenciales de AWS S3 |
| `S3_SECRETKEY` | **Tu AWS Secret Key** | Credenciales de AWS S3 |
| `GEMINI_API_KEY` | **Tu API Key** | Obtener en [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `JWT_SECRET` | Auto-generado | Se genera automáticamente |
| `JWT_EXPIRATION` | `86400000` | 24 horas en ms |
| `CORS_ALLOWED_ORIGINS` | `https://tu-app.vercel.app` | URL del frontend en Vercel |

#### 3. Configurar AWS S3

1. Crear bucket en AWS S3 (región: us-east-2)
2. Nombre del bucket: `urbia-imagenes`
3. Configurar permisos públicos para lectura
4. Generar Access Key y Secret Key en IAM

#### 4. Build Settings en Render

```yaml
Build Command: cd Backend && ./mvnw clean install -DskipTests
Start Command: cd Backend && java -Dserver.port=$PORT -jar target/urbia-0.0.1-SNAPSHOT.jar
```

---

## 🎨 Frontend - Despliegue en Vercel

### Prerequisitos
1. Cuenta en [Vercel](https://vercel.com)
2. URL del backend en Render (después de desplegar)

### Pasos de Despliegue

#### 1. Importar Proyecto

```bash
# En Vercel Dashboard:
1. New Project → Import Git Repository
2. Seleccionar: robre8/Urbia
3. Rama: dev
4. Root Directory: Frontend
```

#### 2. Configurar Build Settings

Vercel detectará automáticamente Vite, pero verifica:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3. Variables de Entorno

En Vercel Project → Settings → Environment Variables:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://urbia-backend.onrender.com/api` | Production |
| `VITE_API_URL` | `http://localhost:8080/api` | Development |

**IMPORTANTE**: Reemplaza `urbia-backend.onrender.com` con la URL real que te dé Render.

#### 4. Actualizar CORS en Backend

Después del primer despliegue, actualiza la variable `CORS_ALLOWED_ORIGINS` en Render con la URL de Vercel:

```
CORS_ALLOWED_ORIGINS=https://tu-nombre-proyecto.vercel.app,http://localhost:5173
```

---

## 🔄 Flujo de Despliegue Completo

### Orden recomendado:

1. **Desplegar Backend en Render** ✅
   - Esperar a que se complete el build (~5-10 min)
   - Anotar la URL del backend (ej: `https://urbia-backend.onrender.com`)

2. **Configurar Variables de Frontend** ✅
   - Actualizar `VITE_API_URL` con la URL del backend

3. **Desplegar Frontend en Vercel** ✅
   - Esperar a que se complete el build (~2-5 min)
   - Anotar la URL del frontend (ej: `https://urbia.vercel.app`)

4. **Actualizar CORS en Backend** ✅
   - Agregar URL del frontend a `CORS_ALLOWED_ORIGINS`
   - Reiniciar servicio de backend en Render

---

## 🧪 Verificación Post-Despliegue

### Backend Health Check
```bash
curl https://urbia-backend.onrender.com/api/health
# Debe responder: 200 OK
```

### Frontend
```bash
# Abrir en navegador:
https://tu-nombre-proyecto.vercel.app

# Verificar en DevTools Console:
# - No debe haber errores de CORS
# - Debe conectarse correctamente al backend
```

### Base de Datos
```bash
# En Render Dashboard → PostgreSQL:
# - Verificar que las tablas se crearon (spring.jpa.hibernate.ddl-auto=update)
# - Revisar logs de conexión
```

---

## 🔐 Seguridad

### ⚠️ IMPORTANTE - API Keys Expuestas

**ACCIÓN URGENTE**: La Gemini API Key está hardcodeada en `application.properties`:

```properties
# ❌ ELIMINAR ESTO DEL CÓDIGO:
gemini.api.key=AIzaSyBRTEylJoZCaJXxJDpL9DDSVA0ryTGhVQc
```

**Solución**:
1. Generar nueva API Key en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Revocar la key expuesta
3. Usar solo variables de entorno: `${GEMINI_API_KEY}`

### Actualizar application.properties

```properties
# ✅ Cambiar a:
gemini.api.url=https://generativelanguage.googleapis.com
gemini.api.key=${GEMINI_API_KEY}
```

---

## 📊 Monitoreo

### Logs en Render
```bash
# Dashboard → Backend Service → Logs
# Monitorear:
# - Errores de conexión a PostgreSQL
# - Errores de S3
# - Requests entrantes
```

### Analytics en Vercel
```bash
# Dashboard → Project → Analytics
# Monitorear:
# - Page views
# - Performance
# - Errores del lado del cliente
```

---

## 🐛 Troubleshooting

### Error: CORS bloqueado
```bash
# Solución: Verificar que CORS_ALLOWED_ORIGINS incluya la URL de Vercel
# Backend → Environment Variables → CORS_ALLOWED_ORIGINS
```

### Error: Database connection failed
```bash
# Solución: Verificar que las variables JDBC estén correctamente configuradas
# Render → PostgreSQL debe estar en estado "Available"
```

### Error: S3 upload failed
```bash
# Solución: Verificar credenciales AWS
# - S3_KEY debe ser válida
# - S3_SECRETKEY debe ser válida
# - Bucket debe existir y tener permisos públicos
```

### Error: Build failed en Render
```bash
# Solución: Verificar Java version
# - Debe ser Java 17
# - Revisar pom.xml para dependencias faltantes
```

---

## 🔄 Actualización de Código

### Backend
```bash
# Render detecta automáticamente cambios en GitHub
# Push a dev → Auto-deploy en Render
git push origin dev
```

### Frontend
```bash
# Vercel detecta automáticamente cambios en GitHub
# Push a dev → Auto-deploy en Vercel
git push origin dev
```

---

## 📞 Soporte

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Spring Boot**: https://docs.spring.io/spring-boot/
- **Vite**: https://vitejs.dev/guide/

---

## ✅ Checklist de Despliegue

- [ ] Backend desplegado en Render
- [ ] PostgreSQL creada y conectada
- [ ] Variables de entorno del backend configuradas (S3, Gemini, JWT)
- [ ] API Key de Gemini renovada (eliminar la expuesta)
- [ ] Frontend desplegado en Vercel
- [ ] Variable VITE_API_URL configurada en Vercel
- [ ] CORS actualizado en backend con URL de Vercel
- [ ] Health check del backend funcionando
- [ ] Frontend carga correctamente (sin errores CORS)
- [ ] Login y autenticación funcionando
- [ ] Upload de imágenes a S3 funcionando
- [ ] Mapas cargando correctamente
- [ ] WebSockets conectados

---

**¡Listo para producción!** 🎉


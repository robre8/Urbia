# Deployment Guide — Urbia

Guía de despliegue actualizada para el estado real del proyecto.

## Arquitectura objetivo
- Frontend: Vercel (`Frontend/`)
- Backend: Railway (FastAPI en `Backend/`)
- Base de datos: PostgreSQL administrado
- Media storage: Cloudinary

---

## 1) Backend (Railway)

## Requisitos
- Proyecto Railway creado
- Servicio PostgreSQL conectado
- Variables de entorno configuradas

## Variables de entorno recomendadas
```env
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=replace_me
GEMINI_API_KEY=replace_me
CLOUDINARY_URL=cloudinary://...
DEBUG=false
```

## Deploy
1. Conecta el repositorio a Railway.
2. Configura `Root Directory` a `Backend` (si aplica).
3. Build command:
   ```bash
   pip install -r requirements.txt
   ```
4. Start command:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Verifica en:
   - `/docs`
   - `/api/reporte`

---

## 2) Frontend (Vercel)

## Variables de entorno
```env
VITE_API_URL=https://<tu-backend-railway>
```

## Deploy
1. Importa el repositorio en Vercel.
2. Configura:
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Publica y valida navegación/login/reportes.

---

## 3) Checklist de validación

- Login y registro funcionan.
- Crear reporte (`POST /api/reporte/combinado`) funciona.
- Editar reporte (`PUT /api/reporte/{id}`) funciona.
- Eliminación de imagen en edición funciona (`eliminarImagen`).
- Moderación de contenido bloquea explícito y permite incidentes urbanos válidos.
- Historial de usuario (`GET /api/reporte/usuario/{user_id}`) funciona.

---

## 4) Troubleshooting rápido

### Error CORS
- Asegura que backend permita origen de Vercel y localhost en desarrollo.

### Error 500 en reportes
- Revisa variables `GEMINI_API_KEY` y `CLOUDINARY_URL`.
- Revisa logs de Railway para `PUT /api/reporte/{id}` y `POST /api/reporte/combinado`.

### Imágenes no se guardan
- Verifica credenciales de Cloudinary.
- Verifica tamaño/tipo de archivo en frontend.

---

## 5) Recomendación operativa

Mantener `dev` y `main` sincronizadas solo por PR aprobado, con checks mínimos:
- Backend: `py_compile` + tests críticos
- Frontend: build y lint

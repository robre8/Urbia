# Urbia

Plataforma de reportes urbanos con mapa interactivo, autenticación JWT y asistencia con IA para moderación y mejora de contenido.

---

## Resumen

Urbia permite crear y gestionar reportes geolocalizados, adjuntar evidencia multimedia y visualizar incidentes en un mapa en tiempo real.

### Estado actual (implementado)
- Creación de reportes con `multipart/form-data`.
- Edición de reportes con reemplazo/eliminación de imagen.
- Moderación de contenido con Gemini (bloqueo explícito, tolerancia a incidentes urbanos legítimos).
- Mejora de redacción con IA + fallback seguro.
- Subida de imágenes a Cloudinary.
- Transcripción de audio y anexado a descripción.
- Autenticación/autorización JWT.
- PWA y mapa interactivo en frontend.

---

## Arquitectura actual

### Frontend
- React + Vite
- Zustand
- Tailwind/UI components
- Leaflet/OpenStreetMap

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT
- Gemini + Cloudinary

### Despliegue
- Frontend: Vercel
- Backend: Railway
- Base de datos: PostgreSQL gestionado

---

## Funcionalidades clave

### Reportes
- `POST /api/reporte/combinado`
  - `reporte` (JSON)
  - `imagen` (opcional)
  - `audio` (opcional)
- `PUT /api/reporte/{id}`
  - reemplazo de imagen
  - eliminación de imagen (`eliminarImagen`)
  - transcripción de audio
  - moderación + enriquecimiento IA
- `DELETE /api/reporte/{id}`
- `GET /api/reporte/usuario/{user_id}`

### Seguridad y calidad
- Verificación de token en operaciones sensibles.
- Control de ownership para editar/eliminar.
- Moderación de contenido explícito.
- Fallbacks para fallas de servicios externos.

---

## Estructura del repositorio

- `Backend/`: API FastAPI, modelos, rutas y servicios.
- `Frontend/`: app React (mapa, auth, formularios, estado).
- `Wiki/`: documentación funcional/producto.
- `DEPLOYMENT.md`: guía de despliegue.
- `CHANGELOG.md`: historial de cambios.
- `ENTERPRISE.md`: blueprint de mejoras enterprise.

---

## Ejecución local

## Requisitos
- Node.js 18+
- Python 3.11+
- PostgreSQL

## Backend
```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python init_db.py
uvicorn main:app --reload
```

API local:
- `http://localhost:8000`
- `http://localhost:8000/docs`

## Frontend
```bash
cd Frontend
npm install
npm run dev
```

App local:
- `http://localhost:3000` (o puerto asignado por Vite)

---

## Variables de entorno

## Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET_KEY=change_me
GEMINI_API_KEY=your_key
CLOUDINARY_URL=cloudinary://...
```

## Frontend
```env
VITE_API_URL=http://localhost:8000
```

---

## Enlaces internos

- `Frontend/README.md`
- `Backend/README.md`
- `DEPLOYMENT.md`
- `CHANGELOG.md`
- `ENTERPRISE.md`
- `Wiki/USER_STORIES.md`
- `Wiki/UX_UI_DESIGN.md`

---

## Licencia

MIT — ver `LICENSE`.

# Backend — Urbia (FastAPI)

API REST de Urbia construida con FastAPI + SQLAlchemy + PostgreSQL.

## Stack
- Python 3.11+
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT auth
- Gemini (moderación + enriquecimiento + transcripción)
- Cloudinary (media)

---

## Setup local

```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python init_db.py
uvicorn main:app --reload
```

Endpoints de documentación:
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

---

## Variables de entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/urbia
JWT_SECRET_KEY=replace_me
GEMINI_API_KEY=replace_me
CLOUDINARY_URL=cloudinary://...
DEBUG=true
```

---

## Endpoints principales

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Reportes
- `GET /api/reporte`
- `GET /api/reporte/{id}`
- `GET /api/reporte/usuario/{user_id}`
- `POST /api/reporte/combinado` (multipart)
- `PUT /api/reporte/{id}` (multipart)
- `DELETE /api/reporte/{id}`
- `DELETE /api/reporte/id/{id}` (legacy)

## Categorías
- Definidas en `app/routes/categories.py`

---

## Notas funcionales

- El endpoint combinado procesa JSON + imagen + audio.
- El audio se transcribe y se integra a la descripción.
- En edición, se soporta reemplazo y eliminación de imagen (`eliminarImagen`).
- Moderación bloquea contenido explícito y permite reportes de incidentes urbanos legítimos.

---

## Testing

```bash
pytest -v
```

Si hay fallas de entorno, validar dependencias y conexión a base de datos primero.

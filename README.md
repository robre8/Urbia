# Urbia

> ⚠️ **Blueprint Enterprise (Propuesta de Mejora):** este documento describe el estado actual del proyecto y una hoja de ruta para evolucionarlo a nivel enterprise. No todos los puntos del blueprint están implementados hoy.

Plataforma de reportes urbanos con mapa interactivo, autenticación JWT y asistencia con IA para moderación y mejora de contenido.

---

## 1) Resumen Ejecutivo

Urbia permite a ciudadanos crear y gestionar reportes geolocalizados (incidentes urbanos), adjuntar evidencia multimedia y consultar el estado de reportes en una interfaz web moderna.

### Capacidades actuales
- Creación y edición de reportes con `multipart/form-data`.
- Moderación de contenido con Gemini (bloqueo de contenido explícito; tolerancia a incidentes reales como accidentes/incendios).
- Mejora de redacción con IA (fallback local cuando IA no responde).
- Subida de imágenes a Cloudinary.
- Transcripción de audio y anexado automático a la descripción.
- Autenticación y autorización por JWT.
- PWA y mapa interactivo en frontend.

---

## 2) Arquitectura Actual

### Frontend
- React + Vite
- Zustand (estado global)
- Tailwind + componentes UI
- Leaflet/OpenStreetMap para visualización geográfica

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- JWT para auth
- Integración con Gemini y Cloudinary

### Despliegue
- Frontend: Vercel
- Backend: Railway/Render (según entorno)
- Base de datos: PostgreSQL gestionado

---

## 3) Funcionalidades Clave

### Reportes
- Alta de reportes (`POST /api/reporte/combinado`) con:
  - payload JSON (`reporte`)
  - imagen opcional (`imagen`)
  - audio opcional (`audio`)
- Edición de reportes (`PUT /api/reporte/{id}`) con soporte para:
  - reemplazo de imagen
  - eliminación de imagen existente (`eliminarImagen`)
  - transcripción de audio
  - moderación + enriquecimiento de texto
- Eliminación de reportes con validación de propietario.
- Historial por usuario (`GET /api/reporte/usuario/{user_id}`).

### Seguridad y control de calidad
- Verificación de token en operaciones sensibles.
- Reglas de ownership para editar/eliminar.
- Moderación IA para contenido explícito.
- Estrategias fallback para no degradar UX ante fallas externas de IA.

---

## 4) Estructura del Repositorio

- `Backend/`: API FastAPI, modelos, rutas, servicios e integración IA.
- `Frontend/`: aplicación React (mapa, auth, formularios, estados).
- `Wiki/`: documentación funcional y de producto.
- `DEPLOYMENT.md`: guía de despliegue.
- `CHANGELOG.md`: historial de cambios.

---

## 5) Guía de Ejecución Local

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

## 6) Variables de Entorno (Referencia)

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

## 7) API (Estado actual resumido)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Reportes
- `GET /api/reporte`
- `GET /api/reporte/{id}`
- `GET /api/reporte/usuario/{user_id}`
- `POST /api/reporte/combinado`
- `PUT /api/reporte/{id}`
- `DELETE /api/reporte/{id}`
- `DELETE /api/reporte/id/{id}` (ruta legacy)

### Categorías
- Endpoints en `Backend/app/routes/categories.py`.

---

## 8) Blueprint Enterprise (Roadmap de Mejora)

Este blueprint propone una evolución incremental, sin romper el producto actual.

## Fase 1 — Foundation (0-2 meses)
- **Observabilidad:** logs estructurados, trazas distribuidas y dashboards SLO.
- **Errores estandarizados:** contrato de error único (código, mensaje, contexto).
- **Migraciones DB formales:** Alembic + strategy de versionado por entorno.
- **Configuración segura:** secretos centralizados (Vault/SSM), rotación y mínimo privilegio.
- **CI baseline:** lint + tests + escaneo de dependencias en pull requests.

## Fase 2 — Reliability & Security (2-4 meses)
- **RBAC completo:** roles (ciudadano, moderador, operador, admin).
- **Rate limiting y anti-abuso:** por IP/usuario/ruta.
- **Idempotencia:** claves idempotentes para operaciones críticas.
- **Políticas de contenido versionadas:** reglas de moderación auditables.
- **Backups y DR:** RPO/RTO definidos, restore tests automáticos.

## Fase 3 — Data & Platform (4-6 meses)
- **Arquitectura asíncrona:** colas para jobs pesados (IA, media processing).
- **Cache distribuida:** Redis para consultas hot y reducción de latencia.
- **Búsqueda avanzada:** indexación geoespacial + full-text.
- **Data governance:** catálogo de datos, trazabilidad y políticas de retención.
- **Entorno staging productivo:** paridad de infraestructura con producción.

## Fase 4 — Enterprise Product (6-12 meses)
- **Multi-tenant / organizaciones** con aislamiento lógico y políticas por tenant.
- **Audit trail inmutable** para acciones críticas y compliance.
- **SLA operativos formales** con on-call, runbooks y postmortems.
- **FinOps:** presupuestos por servicio, alertas de costo y capacity planning.
- **Gobierno de IA:** métricas de calidad, drift, revisión humana en casos sensibles.

---

## 9) Métricas Recomendadas (Enterprise)

### Ingeniería
- Lead time de cambio
- Change failure rate
- MTTR
- Cobertura de tests críticos

### Producto
- Tiempo promedio de creación de reporte
- Tasa de reportes moderados/bloqueados
- % reportes con evidencia multimedia útil
- Tiempo de resolución por categoría

### Plataforma
- p95/p99 de latencia API
- Disponibilidad mensual
- Error rate por endpoint
- Costo por 1.000 reportes procesados

---

## 10) Estándares de Calidad Recomendados

- Definition of Done por feature (tests, seguridad, observabilidad, documentación).
- ADRs para decisiones arquitectónicas relevantes.
- Convenciones de API y versionado semántico.
- Revisión de seguridad para cambios en auth, archivos e IA.

---

## 11) Enlaces internos

- `Frontend/README.md`
- `Backend/README.md`
- `DEPLOYMENT.md`
- `CHANGELOG.md`
- `Wiki/USER_STORIES.md`
- `Wiki/UX_UI_DESIGN.md`

---

## 12) Licencia

MIT — ver `LICENSE`.

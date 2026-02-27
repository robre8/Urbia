# Contributing Guide — Urbia

Gracias por contribuir a Urbia.

## Requisitos
- Node.js 18+
- Python 3.11+
- PostgreSQL
- Git

## Flujo recomendado
1. Crear rama desde `dev`.
2. Implementar cambios pequeños y atómicos.
3. Validar localmente backend/frontend.
4. Abrir PR hacia `dev`.
5. Merge a `main` solo con validación.

## Convención de commits
Usar Conventional Commits (preferido):
- `feat:` nueva funcionalidad
- `fix:` corrección
- `docs:` documentación
- `refactor:` refactor
- `test:` pruebas
- `chore:` mantenimiento

Ejemplos:
- `fix(reports): support image removal on update`
- `docs(readme): align routes with /api/reporte`

## Calidad mínima antes de PR

### Backend
```bash
cd Backend
python -m py_compile app/routes/reports.py
pytest -v
```

### Frontend
```bash
cd Frontend
npm install
npm run build
```

## Criterios de aceptación
- No romper rutas existentes.
- Mantener coherencia entre docs y código.
- Evitar duplicar lógica de negocio.
- Incluir fallback seguro para dependencias externas (IA/servicios de media).

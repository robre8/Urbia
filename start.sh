#!/bin/bash

# Install dependencies
cd Backend
pip install --no-cache-dir -r requirements.txt

# Run migrations (if needed)
python -m alembic upgrade head 2>/dev/null || true

# Start the application (use Railway's PORT variable)
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config.settings import get_settings
from app.config.database import Base, engine
from app.routes import auth, reports, categories

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

settings = get_settings()

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    debug=settings.debug
)

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de hosts confiables
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Incluir rutas
app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(categories.router)


@app.get("/health")
def health_check():
    """Verificar salud de la aplicación"""
    return {
        "status": "healthy",
        "app": settings.app_title,
        "version": settings.app_version
    }


@app.get("/")
def root():
    """Ruta raíz"""
    return {
        "message": "Bienvenido a Urbia API",
        "version": settings.app_version,
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    
    port = int(settings.__dict__.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.debug
    )

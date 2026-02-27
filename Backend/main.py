from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config.settings import get_settings
from app.routes import auth, reports, categories
import logging

logger = logging.getLogger(__name__)

settings = get_settings()

# Crear aplicación FastAPI
app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    debug=settings.debug
)

# Middleware de CORS
cors_origins_str = settings.cors_allowed_origins.strip()
if cors_origins_str == "*":
    cors_origins = ["*"]
    logger.info("🔧 CORS configured: Allow all origins (*)")
else:
    cors_origins = [o.strip() for o in cors_origins_str.split(",")]
    logger.info(f"🔧 CORS configured for origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de hosts confiables
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)


# Evento de startup para inicializar la BD
@app.on_event("startup")
def startup_event():
    """Inicializar base de datos en startup"""
    try:
        from app.config.database import Base, engine
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.warning(f"Database initialization warning: {e}")


# Incluir rutas
app.include_router(auth.router)
app.include_router(reports.router)
app.include_router(categories.router)


@app.get("/health")
def health_check():
    """Verificar salud de la aplicación"""
    cors_setting = settings.cors_allowed_origins
    return {
        "status": "healthy",
        "app": settings.app_title,
        "version": "0.0.2-cors-fix",
        "cors_allow_all": cors_setting == "*",
        "cors_configured": cors_setting
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

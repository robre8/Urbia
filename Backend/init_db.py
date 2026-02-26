"""
Script para inicializar la base de datos con datos de ejemplo
"""

from sqlalchemy.orm import Session
from app.config.database import SessionLocal
from app.models.models import Category


def init_db():
    """Inicializar base de datos con datos de ejemplo"""
    db = SessionLocal()
    
    try:
        # Crear categorías
        categories = [
            {
                "name": "Baches",
                "description": "Baches en calles y avenidas",
                "color": "#FF6B6B",
                "icon": "🕳️"
            },
            {
                "name": "Iluminación",
                "description": "Fallas en iluminación pública",
                "color": "#FFD93D",
                "icon": "💡"
            },
            {
                "name": "Basura",
                "description": "Acumulación de basura",
                "color": "#6BCB77",
                "icon": "🗑️"
            },
            {
                "name": "Seguridad",
                "description": "Reportes de seguridad ciudadana",
                "color": "#4D96FF",
                "icon": "🚨"
            },
            {
                "name": "Transporte",
                "description": "Problemas de transporte público",
                "color": "#FF6B9D",
                "icon": "🚌"
            },
            {
                "name": "Servicios Públicos",
                "description": "Agua, luz, gas y otros servicios",
                "color": "#C780FA",
                "icon": "⚡"
            },
            {
                "name": "Medio Ambiente",
                "description": "Problemas ambientales",
                "color": "#00D9FF",
                "icon": "🌳"
            }
        ]
        
        for cat_data in categories:
            # Verificar si la categoría ya existe
            existing = db.query(Category).filter(
                Category.name == cat_data["name"]
            ).first()
            
            if not existing:
                category = Category(**cat_data)
                db.add(category)
        
        db.commit()
        print("✅ Base de datos inicializada correctamente")
    
    except Exception as e:
        db.rollback()
        print(f"❌ Error al inicializar la base de datos: {str(e)}")
    
    finally:
        db.close()


if __name__ == "__main__":
    init_db()

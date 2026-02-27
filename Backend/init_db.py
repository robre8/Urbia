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
        # Crear categorías que coinciden con el frontend
        # ID 1: Salud, ID 2: Infraestructura, ID 3: Seguridad, ID 4: Eventos Sociales
        categories = [
            {
                "name": "Salud",
                "description": "Reportes relacionados con salud pública",
                "color": "#4CAF50",
                "icon": "🏥"
            },
            {
                "name": "Infraestructura",
                "description": "Baches, calles en mal estado, infraestructura dañada",
                "color": "#FF9800",
                "icon": "🏗️"
            },
            {
                "name": "Seguridad",
                "description": "Reportes de seguridad ciudadana",
                "color": "#2196F3",
                "icon": "🚨"
            },
            {
                "name": "Eventos Sociales",
                "description": "Eventos comunitarios y sociales",
                "color": "#9C27B0",
                "icon": "🎉"
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

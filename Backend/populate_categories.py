"""
Script para poblar las categorías en la base de datos de Railway
Se ejecuta una sola vez después del despliegue
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Category, Base

# Obtener la URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL environment variable not set")
    print("Set it with: $env:DATABASE_URL = 'your-railway-postgres-url'")
    exit(1)

# Crear el engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def populate_categories():
    """Insertar categorías en la base de datos"""
    db = SessionLocal()
    
    try:
        # Categorías que coinciden con el frontend
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
        
        print("🔄 Insertando categorías...")
        
        for cat_data in categories:
            # Verificar si la categoría ya existe
            existing = db.query(Category).filter(
                Category.name == cat_data["name"]
            ).first()
            
            if not existing:
                category = Category(**cat_data)
                db.add(category)
                print(f"  ✅ Categoría '{cat_data['name']}' creada")
            else:
                print(f"  ⏭️  Categoría '{cat_data['name']}' ya existe (ID: {existing.id})")
        
        db.commit()
        
        # Verificar las categorías insertadas
        all_categories = db.query(Category).all()
        print(f"\n✅ Total de categorías en la base de datos: {len(all_categories)}")
        for cat in all_categories:
            print(f"   ID {cat.id}: {cat.name}")
    
    except Exception as e:
        db.rollback()
        print(f"❌ Error al poblar categorías: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        db.close()


if __name__ == "__main__":
    print("📊 Poblando categorías en Railway...")
    print(f"📍 Conectando a: {DATABASE_URL[:50]}...")
    populate_categories()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.models.models import Category
from app.schemas.schemas import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/api/categorias", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Obtener todas las categorías"""
    categories = db.query(Category).filter(Category.is_active == True).all()
    return categories


@router.post("/populate")
def populate_categories(db: Session = Depends(get_db)):
    """Poblar la base de datos con las categorías predeterminadas (solo ejecutar una vez)"""
    try:
        # Categorías que coinciden con el frontend
        # ID 1: Salud, ID 2: Infraestructura, ID 3: Seguridad, ID 4: Eventos Sociales
        categories_data = [
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
        
        created_count = 0
        existing_count = 0
        
        for cat_data in categories_data:
            # Verificar si la categoría ya existe
            existing = db.query(Category).filter(
                Category.name == cat_data["name"]
            ).first()
            
            if not existing:
                category = Category(**cat_data)
                db.add(category)
                created_count += 1
            else:
                existing_count += 1
        
        db.commit()
        
        # Obtener todas las categorías para retornar
        all_categories = db.query(Category).all()
        
        return {
            "message": "Categorías pobladas exitosamente",
            "created": created_count,
            "already_existed": existing_count,
            "total": len(all_categories),
            "categories": [{"id": cat.id, "name": cat.name} for cat in all_categories]
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al poblar categorías: {str(e)}"
        )


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    """Obtener categoría por ID"""
    category = db.query(Category).filter(
        (Category.id == category_id) & (Category.is_active == True)
    ).first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoría no encontrada"
        )
    
    return category


@router.post("", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """Crear nueva categoría"""
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

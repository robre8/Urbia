import json
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.config.security import verify_token
from app.models.models import Report, Category
from app.schemas.schemas import ReportCreate, ReportResponse, ReportUpdate
from app.services.cloudinary_service import get_cloudinary_service, CloudinaryService
from app.services.gemini_service import get_gemini_service, GeminiService

router = APIRouter(prefix="/api/reporte", tags=["reports"])


def _serialize_report_for_frontend(report: Report, categoria_id: int | None = None):
    category_map = {
        "salud": 1,
        "infraestructura": 2,
        "seguridad": 3,
        "eventos sociales": 4,
    }

    normalized_category = (report.category or "").strip().lower()
    resolved_categoria_id = categoria_id or category_map.get(normalized_category)

    return {
        "id": report.id,
        "titulo": report.title,
        "descripcion": report.description or "",
        "descripcionDespuesDeIa": report.description or "",
        "categoriaId": resolved_categoria_id,
        "latitud": report.latitude,
        "longitud": report.longitude,
        "usuarioId": report.user_id,
        "nombreUsuario": "",
        "urlImagen": report.image_url or "",
        "estado": report.status,
        "likes": report.likes_count,
        "createdAt": report.created_at.isoformat() if report.created_at else None,
        "updatedAt": report.updated_at.isoformat() if report.updated_at else None,
    }


@router.post("/combinado")
async def create_report_combined(
    reporte: UploadFile = File(...),
    imagen: UploadFile = File(None),
    audio: UploadFile = File(None),
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    cloudinary_service: CloudinaryService = Depends(get_cloudinary_service),
    gemini_service: GeminiService = Depends(get_gemini_service),
):
    """Crear reporte usando multipart/form-data (reporte JSON + imagen opcional)."""
    try:
        raw_json = await reporte.read()
        report_data = json.loads(raw_json.decode("utf-8"))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campo 'reporte' inválido. Debe ser JSON válido.",
        )

    titulo = (report_data.get("titulo") or "").strip()
    descripcion = (report_data.get("descripcion") or "").strip()
    categoria_id = report_data.get("categoriaId")

    if not titulo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El título es requerido",
        )

    if not categoria_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La categoría es requerida",
        )

    category = db.query(Category).filter(
        (Category.id == int(categoria_id)) & (Category.is_active == True)
    ).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Categoría inválida",
        )

    user_id = int(payload.get("sub"))

    image_bytes = None
    image_mime_type = None
    if imagen and imagen.filename:
        image_bytes = await imagen.read()
        image_mime_type = imagen.content_type

    moderation_result = gemini_service.moderate_report_content(
        title=titulo,
        description=descripcion,
        category_name=category.name,
        image_bytes=image_bytes,
        image_mime_type=image_mime_type,
    )

    if not moderation_result.get("is_allowed", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "unsafe_content",
                "message": moderation_result.get("message")
                or "El contenido del reporte no cumple las políticas de seguridad.",
                "risk_level": moderation_result.get("risk_level", "unknown"),
                "reasons": moderation_result.get("blocked_reasons", []),
            },
        )

    image_url = None
    if imagen and imagen.filename:
        image_url = cloudinary_service.upload_file(
            image_bytes,
            f"report_{user_id}_{imagen.filename}",
            folder="reports",
        )

    ai_result = gemini_service.enhance_report(
        title=titulo,
        description=descripcion,
        category_name=category.name,
        image_url=image_url,
    )

    db_report = Report(
        user_id=user_id,
        title=ai_result.get("title") or titulo,
        description=ai_result.get("description") or descripcion,
        category=category.name,
        latitude=report_data.get("latitud"),
        longitude=report_data.get("longitud"),
        location_name=report_data.get("direccion") or report_data.get("location_name"),
        image_url=image_url,
        status="pending",
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content=_serialize_report_for_frontend(db_report, categoria_id=int(categoria_id)),
    )


@router.get("", response_model=List[ReportResponse])
def get_reports(
    db: Session = Depends(get_db),
    category: str = None,
    skip: int = 0,
    limit: int = 10
):
    """Obtener reportes"""
    query = db.query(Report).filter(Report.is_active == True)
    
    if category:
        query = query.filter(Report.category == category)
    
    reports = query.offset(skip).limit(limit).all()
    return reports


@router.get("/usuario/{user_id}")
def get_reports_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Obtener reportes de un usuario específico"""
    reports = db.query(Report).filter(
        Report.user_id == user_id,
        Report.is_active == True
    ).all()
    
    # Normalizar los reportes al formato del frontend
    return [_serialize_report_for_frontend(report) for report in reports]


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """Obtener reporte por ID"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    return report


@router.post("", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Crear nuevo reporte"""
    user_id = int(payload.get("sub"))
    
    db_report = Report(
        user_id=user_id,
        **report.dict()
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return db_report


@router.post("/{report_id}/upload-image")
async def upload_report_image(
    report_id: int,
    file: UploadFile = File(...),
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    cloudinary_service: CloudinaryService = Depends(get_cloudinary_service)
):
    """Subir imagen a reporte"""
    # Verificar reporte existe
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Verificar que sea el propietario
    user_id = int(payload.get("sub"))
    if report.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para actualizar este reporte"
        )
    
    # Subir imagen a Cloudinary
    file_bytes = await file.read()
    file_url = cloudinary_service.upload_file(
        file_bytes,
        f"{report_id}_{file.filename}",
        folder="reports"
    )
    
    # Actualizar reporte
    report.image_url = file_url
    db.commit()
    
    return {"image_url": file_url}


@router.put("/{report_id}")
async def update_report(
    report_id: int,
    reporte: UploadFile = File(...),
    imagen: UploadFile = File(None),
    audio: UploadFile = File(None),
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    cloudinary_service: CloudinaryService = Depends(get_cloudinary_service),
    gemini_service: GeminiService = Depends(get_gemini_service),
):
    """Actualizar reporte con soporte para multipart/form-data (reporte JSON + imagen opcional)."""
    try:
        # Obtener el reporte existente
        report = db.query(Report).filter(Report.id == report_id).first()
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reporte no encontrado"
            )
        
        # Verificar que sea el propietario
        user_id = int(payload.get("sub"))
        if report.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso para actualizar este reporte"
            )
        
        # Parse reporte JSON from FormData
        try:
            raw_json = await reporte.read()
            report_data = json.loads(raw_json.decode("utf-8"))
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato JSON inválido en el campo reporte"
            )
        
        # Extract and validate required fields
        titulo = report_data.get("titulo", "").strip()
        descripcion = report_data.get("descripcion", "").strip()
        categoria_id = report_data.get("categoriaId")
        
        if not titulo or not categoria_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Título y categoría son requeridos"
            )
        
        # Verify category exists
        category = db.query(Category).filter(Category.id == categoria_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Categoría no encontrada"
            )
        
        # FIRST: Handle image upload if new image provided (process before DB update)
        image_url = report.image_url
        image_bytes = None
        image_mime_type = None
        
        if imagen and imagen.filename:
            # Delete old image from Cloudinary if exists
            if report.image_url:
                try:
                    # Extract filename from secure_url for deletion
                    # Format: "reports/report_userid_filename"
                    parts = report.image_url.split('/')
                    filename_part = parts[-1].split('.')[0]  # Get filename without extension
                    cloudinary_service.delete_file(filename_part, folder="reports")
                except Exception as e:
                    print(f"Error deleting old image: {e}")
            
            # Upload new image using the same pattern as POST
            imagen_bytes = await imagen.read()
            image_mime_type = imagen.content_type
            image_url = cloudinary_service.upload_file(
                imagen_bytes,
                f"report_{user_id}_{imagen.filename}",
                folder="reports",
            )
        
        # SECOND: Moderate content (allow accidents/fires, block explicit content)
        moderation_result = gemini_service.moderate_report_content(
            title=titulo,
            description=descripcion,
            category_name=category.name,
            image_bytes=image_bytes,
            image_mime_type=image_mime_type,
        )
        
        if not moderation_result.get("is_allowed", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "code": "unsafe_content",
                    "message": moderation_result.get("message")
                    or "El contenido actualizado no cumple las políticas de seguridad.",
                    "risk_level": moderation_result.get("risk_level", "unknown"),
                    "reasons": moderation_result.get("blocked_reasons", []),
                },
            )
        
        # THIRD: Enrich report with Gemini (improvement after moderation)
        ai_result = gemini_service.enhance_report(
            title=titulo,
            description=descripcion,
            category_name=category.name,
            image_url=image_url,
        )
        
        # FOURTH: Update report fields and commit to DB (only after all processing succeeds)
        report.title = ai_result.get("title") or titulo
        report.description = ai_result.get("description") or descripcion
        report.category = category.name
        report.image_url = image_url
        # Note: audio upload is received but not stored yet (audio_url column not in DB)
        
        db.commit()
        db.refresh(report)
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=_serialize_report_for_frontend(report, categoria_id=int(categoria_id)),
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error al actualizar reporte: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar reporte: {str(e)}"
        )



@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Eliminar reporte"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    # Verificar que sea el propietario
    user_id = int(payload.get("sub"))
    if report.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para eliminar este reporte"
        )
    
    # Marcar como inactivo (soft delete)
    report.is_active = False
    db.commit()
    
    return {"message": "Reporte eliminado exitosamente"}


@router.delete("/id/{report_id}")
def delete_report_legacy(
    report_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Eliminar reporte (ruta legacy para compatibilidad frontend)."""
    return delete_report(report_id=report_id, payload=payload, db=db)


@router.post("/{report_id}/like")
def like_report(
    report_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Dar like a un reporte"""
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reporte no encontrado"
        )
    
    report.likes_count += 1
    db.commit()
    
    return {"likes_count": report.likes_count}

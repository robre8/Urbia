from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db
from app.config.security import verify_token
from app.models.models import Report
from app.schemas.schemas import ReportCreate, ReportResponse, ReportUpdate
from app.services.cloudinary_service import get_cloudinary_service, CloudinaryService

router = APIRouter(prefix="/api/reporte", tags=["reports"])


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


@router.put("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: int,
    report_update: ReportUpdate,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Actualizar reporte"""
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
    
    # Actualizar campos
    for field, value in report_update.dict(exclude_unset=True).items():
        setattr(report, field, value)
    
    db.commit()
    db.refresh(report)
    
    return report


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

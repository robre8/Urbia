from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Schema base de Usuario"""
    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Schema para crear Usuario"""
    password: str


class UserResponse(UserBase):
    """Schema de respuesta de Usuario"""
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ReportBase(BaseModel):
    """Schema base de Reporte"""
    title: str
    description: Optional[str] = None
    category: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None


class ReportCreate(ReportBase):
    """Schema para crear Reporte"""
    pass


class ReportUpdate(BaseModel):
    """Schema para actualizar Reporte"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    status: Optional[str] = None


class ReportResponse(ReportBase):
    """Schema de respuesta de Reporte"""
    id: int
    user_id: int
    image_url: Optional[str]
    status: str
    likes_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    """Schema base de Categoría"""
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class CategoryCreate(CategoryBase):
    """Schema para crear Categoría"""
    pass


class CategoryResponse(CategoryBase):
    """Schema de respuesta de Categoría"""
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

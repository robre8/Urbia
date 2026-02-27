from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Schema base de Usuario"""
    email: str
    username: str


class UserCreate(UserBase):
    """Schema para crear Usuario"""
    password: str
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        if not v or '@' not in v:
            raise ValueError('email debe ser válido')
        return v.lower()
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        if not v or len(v) < 3:
            raise ValueError('username debe tener al menos 3 caracteres')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not v or len(v) < 6:
            raise ValueError('password debe tener al menos 6 caracteres')
        if len(v) > 72:
            raise ValueError('password no puede exceder 72 caracteres (limite de bcrypt)')
        return v


class UserResponse(UserBase):
    """Schema de respuesta de Usuario"""
    id: int
    is_active: bool = True
    is_verified: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
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
    updated_at: Optional[datetime] = None
    
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
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

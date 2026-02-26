import cloudinary
import cloudinary.uploader
from app.config.settings import get_settings

settings = get_settings()


class CloudinaryService:
    """Servicio para interactuar con Cloudinary"""
    
    def __init__(self):
        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
            secure=True
        )
    
    def upload_file(self, file_bytes: bytes, file_name: str, folder: str = "") -> str:
        """Subir archivo a Cloudinary"""
        try:
            # Cloudinary maneja el folder automáticamente
            public_id = f"{folder}/{file_name}" if folder else file_name
            
            # Upload devuelve un dict con 'secure_url', 'public_id', etc
            result = cloudinary.uploader.upload(
                file_bytes,
                public_id=public_id,
                resource_type="auto",  # Detecta automáticamente si es imagen, video, etc
                overwrite=True
            )
            
            return result['secure_url']
        except Exception as e:
            raise Exception(f"Error al subir archivo a Cloudinary: {str(e)}")
    
    def delete_file(self, file_name: str, folder: str = "") -> bool:
        """Eliminar archivo de Cloudinary"""
        try:
            public_id = f"{folder}/{file_name}" if folder else file_name
            
            cloudinary.uploader.destroy(public_id)
            return True
        except Exception as e:
            raise Exception(f"Error al eliminar archivo de Cloudinary: {str(e)}")


def get_cloudinary_service() -> CloudinaryService:
    """Obtener instancia del servicio Cloudinary"""
    return CloudinaryService()

import boto3
from app.config.settings import get_settings

settings = get_settings()


class S3Service:
    """Servicio para interactuar con AWS S3"""
    
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region
        )
        self.bucket_name = settings.s3_bucket_name
    
    def upload_file(self, file_bytes: bytes, file_name: str, folder: str = "") -> str:
        """Subir archivo a S3"""
        try:
            key = f"{folder}/{file_name}" if folder else file_name
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file_bytes,
                ACL='public-read'
            )
            
            file_url = f"https://{self.bucket_name}.s3.{settings.aws_region}.amazonaws.com/{key}"
            return file_url
        except Exception as e:
            raise Exception(f"Error al subir archivo a S3: {str(e)}")
    
    def delete_file(self, file_name: str, folder: str = "") -> bool:
        """Eliminar archivo de S3"""
        try:
            key = f"{folder}/{file_name}" if folder else file_name
            
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=key
            )
            return True
        except Exception as e:
            raise Exception(f"Error al eliminar archivo de S3: {str(e)}")


def get_s3_service() -> S3Service:
    """Obtener instancia del servicio S3"""
    return S3Service()

import google.generativeai as genai
from app.config.settings import get_settings

settings = get_settings()


class GeminiService:
    """Servicio para interactuar con Gemini API"""
    
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
    
    def generate_text(self, prompt: str) -> str:
        """Generar texto con Gemini"""
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Error al generar texto con Gemini: {str(e)}")


def get_gemini_service() -> GeminiService:
    """Obtener instancia del servicio Gemini"""
    return GeminiService()

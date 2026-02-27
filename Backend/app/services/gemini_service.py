import google.generativeai as genai
import json
import re
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

    def enhance_report(
        self,
        title: str,
        description: str,
        category_name: str,
        image_url: str | None = None,
    ) -> dict:
        """Mejora título y descripción del reporte usando Gemini."""
        if not settings.gemini_api_key:
            return {
                "title": title,
                "description": description,
                "used_ai": False,
                "reason": "gemini_api_key_not_configured",
            }

        prompt = (
            "Eres un asistente de reportes ciudadanos de Urbia. "
            "Con la información recibida, redacta un reporte más claro, específico y útil para autoridades locales. "
            "No inventes hechos. Si falta información, mantenlo realista. "
            "Responde SOLO en JSON válido con esta forma exacta: "
            '{"titulo":"...","descripcion":"..."}.\n\n'
            f"Categoría: {category_name}\n"
            f"Título original: {title}\n"
            f"Descripción original: {description}\n"
            f"URL de imagen (si existe): {image_url or 'sin imagen'}"
        )

        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            raw_text = (response.text or "").strip()

            # Intentar parseo directo JSON
            try:
                parsed = json.loads(raw_text)
            except Exception:
                # Extraer primer bloque JSON del texto si vino con ruido
                match = re.search(r"\{.*\}", raw_text, re.DOTALL)
                parsed = json.loads(match.group(0)) if match else {}

            improved_title = (parsed.get("titulo") or title).strip()
            improved_description = (parsed.get("descripcion") or description).strip()

            return {
                "title": improved_title or title,
                "description": improved_description or description,
                "used_ai": True,
                "reason": None,
            }
        except Exception:
            return {
                "title": title,
                "description": description,
                "used_ai": False,
                "reason": "gemini_processing_failed",
            }


def get_gemini_service() -> GeminiService:
    """Obtener instancia del servicio Gemini"""
    return GeminiService()

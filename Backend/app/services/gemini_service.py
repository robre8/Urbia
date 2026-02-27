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
    
    def transcribe_audio(self, audio_bytes: bytes, audio_mime_type: str) -> str:
        """Transcribir audio a texto usando Gemini"""
        if not settings.gemini_api_key:
            return ""
        
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Crear el contenido con audio
            audio_part = {
                "mime_type": audio_mime_type,
                "data": audio_bytes
            }
            
            prompt = (
                "Transcribe el siguiente audio a texto en español. "
                "Devuelve SOLO el texto transcrito, sin comentarios adicionales. "
                "Si no hay audio o no se puede transcribir, responde con una cadena vacía."
            )
            
            response = model.generate_content([prompt, audio_part])
            transcribed_text = (response.text or "").strip()
            
            return transcribed_text
        except Exception as e:
            print(f"Error transcribiendo audio: {e}")
            return ""

    def _fallback_enhancement(self, title: str, description: str, category_name: str) -> dict:
        normalized_title = (title or '').strip()
        normalized_description = (description or '').strip()

        # Check if text was already enhanced (to prevent duplication on updates)
        already_enhanced = (
            "Se reporta el siguiente incidente" in normalized_description or
            "Se registra un incidente" in normalized_description or
            "Se solicita revisión y atención" in normalized_description
        )

        if already_enhanced:
            # Return text as-is if already enhanced
            return {
                "title": normalized_title,
                "description": normalized_description,
                "used_ai": False,
                "reason": "already_enhanced",
            }

        if normalized_title and len(normalized_title) < 12:
            improved_title = f"Reporte de {category_name}: {normalized_title}".strip()
        else:
            improved_title = normalized_title or f"Reporte ciudadano de {category_name}".strip()

        if normalized_description:
            improved_description = (
                f"Se reporta el siguiente incidente en la categoría {category_name}: "
                f"{normalized_description}. "
                "Se solicita revisión y atención por parte de la autoridad correspondiente."
            )
        else:
            improved_description = (
                f"Se registra un incidente en la categoría {category_name}. "
                "Se solicita verificación en el sitio y gestión de una solución."
            )

        return {
            "title": improved_title,
            "description": improved_description,
            "used_ai": False,
            "reason": "fallback_enhancement",
        }

    def enhance_report(
        self,
        title: str,
        description: str,
        category_name: str,
        image_url: str | None = None,
    ) -> dict:
        """Mejora título y descripción del reporte usando Gemini."""
        if not settings.gemini_api_key:
            return self._fallback_enhancement(title, description, category_name)

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

            # Si Gemini devuelve casi igual al original, aplicar enriquecimiento mínimo
            title_changed = improved_title.lower() != (title or '').strip().lower()
            description_changed = improved_description.lower() != (description or '').strip().lower()
            if not title_changed and not description_changed:
                return self._fallback_enhancement(title, description, category_name)

            return {
                "title": improved_title or title,
                "description": improved_description or description,
                "used_ai": True,
                "reason": None,
            }
        except Exception:
            return self._fallback_enhancement(title, description, category_name)

    def moderate_report_content(
        self,
        title: str,
        description: str,
        category_name: str,
        image_bytes: bytes | None = None,
        image_mime_type: str | None = None,
    ) -> dict:
        """Analiza seguridad del contenido textual y visual para reportes ciudadanos."""
        if not settings.gemini_api_key:
            return {
                "is_allowed": True,
                "risk_level": "unknown",
                "blocked_reasons": [],
                "message": "Moderación automática no disponible en este momento.",
                "reason": "gemini_api_key_not_configured",
            }

        moderation_prompt = (
            "Evalúa si este reporte ciudadano es apto para publicarse en una plataforma general. "
            "Importante: reportar incidentes urbanos como incendios, choques o inseguridad SI está permitido, "
            "siempre que NO incluya detalles gráficos extremos. "
            "Debes bloquear si detectas: desnudos o contenido sexual explícito, violencia explícita/gore, "
            "discurso de odio, amenazas, acoso severo, autolesión, o contenido altamente ofensivo. "
            "Responde SOLO JSON válido con formato exacto: "
            '{"is_allowed":true,"risk_level":"low|medium|high","blocked_reasons":["..."],"message":"..."}. '
            "Si hay imagen, inclúyela en el análisis. No inventes información."
            f"\n\nCategoría: {category_name}"
            f"\nTítulo: {title}"
            f"\nDescripción: {description}"
        )

        content_parts = [moderation_prompt]
        if image_bytes:
            content_parts.append(
                {
                    "mime_type": image_mime_type or "image/jpeg",
                    "data": image_bytes,
                }
            )

        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(content_parts)
            raw_text = (response.text or "").strip()

            try:
                parsed = json.loads(raw_text)
            except Exception:
                match = re.search(r"\{.*\}", raw_text, re.DOTALL)
                parsed = json.loads(match.group(0)) if match else {}

            is_allowed = bool(parsed.get("is_allowed", True))
            risk_level = str(parsed.get("risk_level", "low"))
            blocked_reasons = parsed.get("blocked_reasons") or []
            if not isinstance(blocked_reasons, list):
                blocked_reasons = [str(blocked_reasons)]

            message = str(parsed.get("message") or "")

            normalized_reasons = [str(reason).strip().lower() for reason in blocked_reasons]

            # Si el modelo no está seguro o reporta error de análisis, no bloquear por falso positivo
            uncertain_markers = {
                "uncertain",
                "unknown",
                "cannot_determine",
                "unable_to_analyze",
                "analysis_failed",
                "low_confidence",
            }
            if any(marker in uncertain_markers for marker in normalized_reasons):
                is_allowed = True
                normalized_reasons = []

            return {
                "is_allowed": is_allowed,
                "risk_level": risk_level,
                "blocked_reasons": normalized_reasons,
                "message": message,
            }
        except Exception:
            return {
                "is_allowed": True,
                "risk_level": "unknown",
                "blocked_reasons": [],
                "message": "No se pudo validar la seguridad del contenido automáticamente.",
                "reason": "moderation_failed",
            }


def get_gemini_service() -> GeminiService:
    """Obtener instancia del servicio Gemini"""
    return GeminiService()

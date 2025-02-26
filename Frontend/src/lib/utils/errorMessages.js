export function getGeolocationErrorMessage(geolocationStatus, error) {
    if (geolocationStatus === "browser_denied") {
      return "Permiso de ubicación denegado. Habilita la ubicación en tu navegador o elige una ciudad.";
    } else if (
      geolocationStatus === "browser_unavailable" ||
      geolocationStatus === "browser_timeout" ||
      geolocationStatus === "ip_error_default" ||
      geolocationStatus === "timeout_default"
    ) {
      return "No se pudo obtener tu ubicación precisa. Mostrando ubicación aproximada o elige una ciudad.";
    } else if (geolocationStatus === "unsupported") {
      return "Tu navegador no soporta geolocalización. Usando ubicación por defecto o elige una ciudad.";
    } else if (error) {
      return `Error al obtener ubicación: ${error}. Puedes elegir una ciudad.`;
    }
    return null;
  }
  
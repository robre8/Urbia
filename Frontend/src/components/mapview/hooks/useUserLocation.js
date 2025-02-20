import { useState, useEffect } from 'react';

export function useUserLocation(defaultCenter = [-34.6037, -58.3816]) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocalización no soportada en este navegador.');
      setError('Geolocalización no soportada.');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true, // Intentar usar GPS o Wi-Fi
      timeout: 5000, // Máximo 5 segundos esperando respuesta
      maximumAge: 0, // No usar cache
    };

    const handleSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setPosition([latitude, longitude]);
      setAccuracy(accuracy);
      setLoading(false);

      // Si la precisión es muy baja, intentamos otra vez hasta un máximo de 3 veces
      if (accuracy > 1000 && attempts < 3) {
        console.warn(`Precisión baja (${accuracy}m). Reintentando...`);
        setAttempts(prev => prev + 1);
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
      }
    };

    const handleError = (err) => {
      console.error('Error obteniendo la ubicación:', err);
      let errorMsg = 'No se pudo obtener la ubicación.';

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMsg = 'El usuario denegó el permiso de ubicación.';
          break;
        case err.POSITION_UNAVAILABLE:
          errorMsg = 'La información de ubicación no está disponible.';
          break;
        case err.TIMEOUT:
          errorMsg = 'Tiempo de espera agotado al obtener la ubicación.';
          break;
        default:
          errorMsg = 'Ocurrió un error desconocido.';
      }

      setError(errorMsg);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

  }, [attempts]); // Se reintentará si la precisión es muy baja

  // Si no hay ubicación, usar el centro por defecto
  const center = position || defaultCenter;

  return { center, position, accuracy, error, loading };
}

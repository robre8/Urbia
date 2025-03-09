// hooks/useReverseGeocode.js
import { useState, useEffect } from "react";

export function useReverseGeocode(position) {
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  // Volvemos a añadir el estado de error para mantener compatibilidad
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!position) return; // Hasta que no haya coordenadas, no hacemos nada
    const [lat, lon] = position;

    async function fetchAddress() {
      setLoadingAddress(true);
      try {
        // Usando OpenCage como alternativa (necesitas registrarte para obtener una API key gratuita)
        // Regístrate en: https://opencagedata.com/
        const API_KEY =import.meta.env.VITE_GEOREVERSE_API_KEY; // Reemplaza con tu API key de OpenCage
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY}&language=es&pretty=1`,
          {
            signal: AbortSignal.timeout(5000)
          }
        );
        
        console.log("Status de la respuesta:", res.status);
        
        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`);
          // Establecemos el error pero no lo mostramos
          setError(`HTTP error! status: ${res.status}`);
          setAddress(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);
          return;
        }

        const data = await res.json();
        console.log("Datos recibidos:", data);
        
        if (data.results && data.results.length > 0) {
          // OpenCage proporciona resultados formateados
          const result = data.results[0];
          
          // Extraer componentes específicos de la dirección
          const { road, house_number, suburb, neighbourhood, city_district } = result.components || {};
          
          // Usar el barrio (suburb) o vecindario si está disponible
          const area = suburb || neighbourhood || city_district || "";
          
          // Formatear solo con calle, número y barrio
          setAddress(`${road || ""}${house_number ? ` ${house_number}` : ""}${area ? `, ${area}` : ""}`);
          
          // Limpiamos cualquier error previo
          setError(null);
        } else {
          console.log("No se encontró dirección en la respuesta");
          setError("No se encontró dirección en la respuesta");
          setAddress(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);
        }
      } catch (err) {
        console.error("Error reverse geocode:", err);
        setError(err.message);
        setAddress(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);
      } finally {
        setLoadingAddress(false);
      }
    }

    fetchAddress();
  }, [position]);

  // Devolvemos el error real para mantener la compatibilidad con el código existente
  return { address, loadingAddress, error };
}
// hooks/useReverseGeocode.js
import { useState, useEffect } from "react";

export function useReverseGeocode(position) {
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!position) return; // Hasta que no haya coordenadas, no hacemos nada
    const [lat, lon] = position;

    async function fetchAddress() {
      setLoadingAddress(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`,
          {
            headers: {
              "User-Agent": "MiApp/1.0.0 (https://example.com) Contact: correo@example.com",
            },
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.address) {
          const { road, house_number } = data.address;
          // Ajusta el formato como prefieras:
          setAddress(`${road || ""}${house_number ? ` #${house_number}` : ""}`);
        } else {
          setError("No se encontró dirección en la respuesta");
        }
      } catch (err) {
        console.error("Error reverse geocode:", err);
        setError(err.message);
      } finally {
        setLoadingAddress(false);
      }
    }

    fetchAddress();
  }, [position]);

  return { address, loadingAddress, error };
}

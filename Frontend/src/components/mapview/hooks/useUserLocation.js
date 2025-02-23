import { useState, useEffect } from 'react';

export function useUserLocation(defaultCenter = [-34.6037, -58.3816]) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY; // Para Vite
  // const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; // Para Create React App

  useEffect(() => {
    let isMounted = true;

    async function fetchIPLocation() {
      try {
        const res = await fetch("https://ipinfo.io/json?token=TU_TOKEN");
        const data = await res.json();
        const [lat, lon] = data.loc.split(",");
        if (isMounted) {
          setPosition([parseFloat(lat), parseFloat(lon)]);
          setAccuracy(5000);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error obteniendo ubicación por IP:", err);
      }
    }

    if (!navigator.geolocation) {
      console.warn("Geolocalización no soportada.");
      setError("Geolocalización no soportada.");
      setLoading(false);
      fetchIPLocation();
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const handleSuccess = async (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;

      if (isMounted) {
        setPosition([latitude, longitude]);
        setAccuracy(accuracy);
        setLoading(false);
      }

      if (accuracy > 1000 && attempts < 2) {
        console.warn(`Precisión baja (${accuracy}m). Intentando Google API...`);
        setAttempts((prev) => prev + 1);

        try {
          const googleRes = await fetch(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
            { method: "POST" }
          );
          const googleData = await googleRes.json();
          if (googleData.location && isMounted) {
            setPosition([googleData.location.lat, googleData.location.lng]);
            setAccuracy(googleData.accuracy);
          }
        } catch (err) {
          console.error("Error con Google API:", err);
        }
      }
    };

    const handleError = (err) => {
      console.error("Error obteniendo ubicación:", err);
      setError("No se pudo obtener la ubicación.");
      setLoading(false);
      fetchIPLocation();
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);

    return () => {
      isMounted = false;
    };
  }, [attempts]);

  const center = position || defaultCenter;

  return { center, position, accuracy, error, loading };
}

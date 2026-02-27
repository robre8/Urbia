import { useState, useEffect, useRef } from 'react';

export function useUserLocation(defaultCenter = [-34.6037, -58.3816]) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geolocationStatus, setGeolocationStatus] = useState('loading');
  const attemptsRef = useRef(0);
  const lastBrowserPositionRef = useRef(null);

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const IPINFO_API_KEY = import.meta.env.VITE_IPINFO_TOKEN;
  // REMOVED IPAPI_API_KEY const IPAPI_API_KEY = import.meta.env.VITE_IPAPI_TOKEN;

  useEffect(() => {
    let isMounted = true;
    attemptsRef.current = 0;
    setLoading(true);
    setGeolocationStatus('loading');
    setError(null);

    const initialTimeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("Timeout inicial al obtener ubicación. Usando ubicación por defecto.");
        setPosition(defaultCenter);
        setLoading(false);
        setGeolocationStatus('timeout_default');
        setError("Tiempo de espera agotado. Usando ubicación por defecto.");
      }
    }, 15000);

    async function fetchIPLocationFallback() {
      if (!isMounted || !loading) return;
      if (!IPINFO_API_KEY) {
        clearTimeout(initialTimeoutId);
        setLoading(false);
        setGeolocationStatus('ip_error_default');
        setError("No se pudo obtener ubicación por IP. Falta VITE_IPINFO_TOKEN.");
        setPosition(defaultCenter);
        return;
      }
      let ipLocationData = null;
      let ipError = null;

      // Intentar solo ipinfo.io
      try {
        const ipinfoRes = await fetch(`https://ipinfo.io/json?token=${IPINFO_API_KEY}`);
        if (!ipinfoRes.ok) {
          throw new Error(`ipinfo response ${ipinfoRes.status}`);
        }
        ipLocationData = await ipinfoRes.json();
        if (!ipLocationData.loc) throw new Error("No location data from ipinfo.io");
      } catch (ipinfoErr) {
        console.warn("Error con ipinfo.io:", ipinfoErr);
        ipError = ipinfoErr;
      }

      if (isMounted && loading) {
        clearTimeout(initialTimeoutId);
        if (ipLocationData && ipLocationData.loc) {
          const [latStr, lonStr] = ipLocationData.loc.split(",");
          const lat = Number.parseFloat(latStr);
          const lon = Number.parseFloat(lonStr);
          if (Number.isNaN(lat) || Number.isNaN(lon)) {
            setLoading(false);
            setGeolocationStatus('ip_error_default');
            setError("Formato de ubicacion invalido desde ipinfo.io. Usando ubicacion por defecto.");
            setPosition(defaultCenter);
            return;
          }
          setPosition([lat, lon]);
          setAccuracy(5000);
          setLoading(false);
          setGeolocationStatus('ip_fallback');
        } else {
          setLoading(false);
          setGeolocationStatus('ip_error_default');
          setError(`No se pudo obtener ubicación por IP. Usando ubicación por defecto. (ipinfo error: ${ipError?.message || 'N/A'})`);
          setPosition(defaultCenter);
          console.error("Fallo geolocalización por IP. Usando ubicación por defecto.", ipError);
        }
      }
    }

    // ... (rest of the useEffect and hook code remains the same from here onwards) ...

    if (!navigator.geolocation) {
      console.warn("Geolocalización no soportada por el navegador.");
      setError("Geolocalización no soportada en este navegador.");
      setGeolocationStatus('unsupported');
      fetchIPLocationFallback();
      clearTimeout(initialTimeoutId);
      return;
    } else {
      setGeolocationStatus('browser_supported');
    }

    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleBrowserGeolocationSuccess = async (pos) => {
      clearTimeout(initialTimeoutId);
      const { latitude, longitude, accuracy: browserAccuracy } = pos.coords;
      let fusedLatitude = latitude;
      let fusedLongitude = longitude;
      let fusedAccuracy = browserAccuracy;
      lastBrowserPositionRef.current = pos;

      if (isMounted && loading) {
        setPosition([fusedLatitude, fusedLongitude]);
        setAccuracy(fusedAccuracy);
        setLoading(false);
        setGeolocationStatus('browser_success');
      }

      if (browserAccuracy > 500 && attemptsRef.current < 2) {
        attemptsRef.current++;
        console.warn(`Precisión del navegador baja (${browserAccuracy}m). Intentando Google Geolocation API (Intento ${attemptsRef.current})...`);
        setGeolocationStatus('google_api_attempt');

        try {
          const googleRes = await fetch(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
            { method: "POST" }
          );
          const googleData = await googleRes.json();

          if (googleData.location) {
            const googleAccuracy = googleData.accuracy || 2000;

            const browserWeight = 1 / browserAccuracy;
            const googleWeight = 1 / googleAccuracy;
            const totalWeight = browserWeight + googleWeight;

            fusedLatitude = (latitude * browserWeight + googleData.location.lat * googleWeight) / totalWeight;
            fusedLongitude = (longitude * browserWeight + googleData.location.lng * googleWeight) / totalWeight;
            fusedAccuracy = Math.min(browserAccuracy, googleAccuracy);

            if (isMounted && loading) {
              setPosition([fusedLatitude, fusedLongitude]);
              setAccuracy(fusedAccuracy);
              setLoading(false);
              setGeolocationStatus('google_api_success_fused');
            }
          } else {
            console.warn("Google API no devolvió ubicación válida para refinar.");
            if (isMounted && geolocationStatus !== 'ip_fallback' && geolocationStatus !== 'ip_error_default') {
              setGeolocationStatus('google_api_no_location');
            }
          }
        } catch (googleErr) {
          console.error("Error con Google Geolocation API:", googleErr);
          if (isMounted && geolocationStatus !== 'ip_fallback' && geolocationStatus !== 'ip_error_default') {
             setGeolocationStatus('google_api_error');
          }
        }
      }
    };

    const handleBrowserGeolocationError = (err) => {
      clearTimeout(initialTimeoutId);
      setLoading(false);
      console.error("Error geolocalización del navegador:", err);
      if (err.code === 1) {
        setError("Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.");
        setGeolocationStatus('browser_denied');
        console.warn("Permiso de geolocalización denegado por el usuario.");
        fetchIPLocationFallback();
      } else if (err.code === 2) {
        setError("Ubicación del navegador no disponible. Intentando ubicación por IP...");
        setGeolocationStatus('browser_unavailable');
        console.warn("Ubicación del navegador no disponible. Fallback a IP.");
        fetchIPLocationFallback();
      } else if (err.code === 3) {
        setError("Tiempo de espera agotado al obtener la ubicación del navegador. Intentando ubicación por IP...");
        setGeolocationStatus('browser_timeout');
        console.warn("Timeout de geolocalización del navegador. Fallback a IP.");
        fetchIPLocationFallback();
      } else {
        setError(`Error desconocido al obtener ubicación del navegador (${err.message}). Intentando ubicación por IP...`);
        setGeolocationStatus('browser_error');
        console.error("Error desconocido de geolocalización del navegador:", err.message);
        fetchIPLocationFallback();
      }
    };

    navigator.geolocation.getCurrentPosition(handleBrowserGeolocationSuccess, handleBrowserGeolocationError, geolocationOptions);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeoutId);
    };
  }, []);

  const center = position || defaultCenter;

  return { center, position, accuracy, error, loading, geolocationStatus };
}
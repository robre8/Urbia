// hooks/useReverseGeocode.js
import { useState, useEffect } from "react";

export function useReverseGeocode(position) {
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!position) return; // Don't do anything until we have coordinates
    const [lat, lon] = position;

    async function fetchAddress() {
      setLoadingAddress(true);
      try {
        // Check if API key exists
        const API_KEY = import.meta.env.VITE_GEOREVERSE_API_KEY;
        
        if (!API_KEY) {
          console.warn("Missing geocoding API key");
          setAddress(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);
          setError("Missing API key");
          setLoadingAddress(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${API_KEY}&language=es&pretty=1`,
          {
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`);
          setError(`HTTP error! status: ${res.status}`);
          setAddress(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);
          setLoadingAddress(false);
          return;
        }

        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const { road, house_number, suburb, neighbourhood, city_district } = result.components || {};
          const area = suburb || neighbourhood || city_district || "";
          setAddress(`${road || ""}${house_number ? ` ${house_number}` : ""}${area ? `, ${area}` : ""}`);
          setError(null);
        } else {
          console.log("No address found in response");
          setError("No address found in response");
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

  return { address, loadingAddress, error };
}
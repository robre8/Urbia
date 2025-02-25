import { useState, useEffect } from "react";
import citiesData from "../data/cities.json";

export function useCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula un pequeño delay para que se vea natural
    setTimeout(() => {
      setCities(citiesData);
      setLoading(false);
    }, 300); 
  }, []);

  return { cities, loading };
}

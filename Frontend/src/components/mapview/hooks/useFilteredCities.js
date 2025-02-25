import { useMemo } from "react";
import { useCities } from "./useCities";

// Mapeo de ciudades prioritarias por idioma
const languageCityMap = {
  es: ["Madrid", "Buenos Aires", "Ciudad de México", "Santiago", "Bogotá", "Caracas"],
  en: ["New York", "London", "Sydney", "Los Angeles"],
  fr: ["Paris", "Marseille", "Lyon"],
  pt: ["São Paulo", "Rio de Janeiro", "Lisboa", "Brasilia"],
  de: ["Berlin", "München", "Hamburg"],
};

export function useFilteredCities() {
  const { cities, loading, error } = useCities();

  // Obtener el idioma del usuario de forma más precisa
  const userLang = navigator.languages ? navigator.languages[0] : navigator.language;
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const langCode = userLang.split("-")[0] || locale.split("-")[0];

  // Procesar las ciudades para obtener las recomendadas y ordenarlas
  const { priorityCities, groupedCities } = useMemo(() => {
    const priorityCities = cities.filter(city => (languageCityMap[langCode] || []).includes(city.name)).slice(0, 4);
    const remainingCities = cities.filter(city => !priorityCities.includes(city)).sort((a, b) => a.name.localeCompare(b.name));

    // Agrupar las demás ciudades por la primera letra
    const groupedCities = [...new Set(remainingCities.map(city => city.name[0]))]
      .sort()
      .map(letter => ({
        letter,
        cities: remainingCities.filter(city => city.name.startsWith(letter)),
      }));

    return { priorityCities, groupedCities };
  }, [cities, langCode]);

  return { priorityCities, groupedCities, loading, error };
}

import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useFilteredCities } from "./hooks/useFilteredCities";
import { MapPin } from "lucide-react"; // Ícono de ubicación

export default function CityNavigation({ map }) {
  const { priorityCities, groupedCities, loading } = useFilteredCities();
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (selectedCity && map) {
      const city = [...priorityCities, ...groupedCities.flatMap(group => group.cities)]
        .find((c) => c.name === selectedCity);
      if (city) {
        map.flyTo([city.lat, city.lng], 12, { duration: 1.2 }); // 👈 Animación suave al moverse
      }
    }
  }, [selectedCity, map]);

  if (loading) return null;

  return (
    <div className="absolute bottom-5 left-5 lg:bottom-10 lg:left-10 z-[9999]">
      <Select onValueChange={setSelectedCity}>
        <SelectTrigger className="flex items-center gap-2 w-[220px] bg-green-500 text-black rounded-full px-4 py-3 shadow-lg transition-all hover:bg-green-600 focus:ring-2 focus:ring-green-400">
          <MapPin className="w-5 h-5" /> 
          {selectedCity || "Selecciona una ciudad"}
        </SelectTrigger>
        <SelectContent className="max-h-[240px] overflow-y-auto bg-white shadow-md rounded-lg">
          {/* Ciudades recomendadas */}
          {priorityCities.length > 0 && (
            <>
              <div className="px-2 py-1 text-sm font-bold bg-gray-200">🌎 Ciudades recomendadas</div>
              {priorityCities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
              <div className="border-b border-gray-300 my-1" />
            </>
          )}

          {/* Ciudades agrupadas por letra */}
          {groupedCities.map(({ letter, cities }) => (
            <div key={letter}>
              <div className="px-2 py-1 text-sm font-bold bg-gray-100">{letter}</div>
              {cities.map(city => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

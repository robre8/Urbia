import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useFilteredCities } from "./hooks/useFilteredCities";

export default function CitySelectionDialog({ open, onClose, map, onCitySelect, message }) {
  const { priorityCities, groupedCities, loading } = useFilteredCities();

  const handleCitySelect = (value) => {
    onCitySelect(value); // Llamamos a la función externa si existe
    if (map) {
      const city = [...priorityCities, ...groupedCities.flatMap(group => group.cities)]
        .find((c) => c.name === value);
      if (city) {
        map.flyTo([city.lat, city.lng], 12, { duration: 1.2 }); // 👈 Zoom más amplio y animación más fluida
      }
    }
  };
  

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="z-[9999]">
        <DialogTitle>Selecciona una Ciudad</DialogTitle>
        <DialogDescription>{message}</DialogDescription>
        
        <Select onValueChange={handleCitySelect}>
          <SelectTrigger>Elige una ciudad</SelectTrigger>
          <SelectContent className="max-h-[240px] overflow-y-auto">
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
        
        <Button variant="outline" onClick={onClose}>Cerrar</Button>
      </DialogContent>
    </Dialog>
  );
}

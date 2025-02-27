

import {  useState } from "react";
import { useFilteredCities } from "./hooks/useFilteredCities";
import { MapPin, Check, Search } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CityNavigation({ map }) {
  const { priorityCities, groupedCities, loading } = useFilteredCities();
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (value) => {
    setSelectedCity(value);
    setOpen(false);

    if (map) {
      const city = [...priorityCities, ...groupedCities.flatMap(group => group.cities)]
        .find((c) => c.name === value);
      if (city) {
        map.flyTo([city.lat, city.lng], 12, { duration: 1.2 });
      }
    }
  };

  if (loading) return null;

  return (
    <div className="absolute bottom-10 left-5 lg:bottom-10 lg:left-10 z-[9999]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex items-center  w-[218px] h-[48px] bg-[#9bee5e] text-black rounded-2xl  shadow-lg transition-all hover:bg-[#C8F79f] z-[9999]"
          >
            <MapPin className="w-5 h-5" />
            {selectedCity || "Selecciona una ciudad"}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center" className="w-[220px] p-0   z-[9999]">
          <Command>
            <CommandList className="max-h-[240px] overflow-y-auto">
              <CommandEmpty>No se encontró ninguna ciudad.</CommandEmpty>

              {/* Ciudades recomendadas - ahora en negrita */}
              {priorityCities.length > 0 && (
                <CommandGroup>
                  <div className="text-xs font-bold text-black">
                    🌎 Ciudades recomendadas
                  </div>
                  {priorityCities.map((city) => (
                    <CommandItem
                      key={city.name}
                      value={city.name}
                      onSelect={handleCitySelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCity === city.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.name}
                    </CommandItem>
                  ))}
                  <div className="h-[1px] w-full bg-gray-300 "></div>
                </CommandGroup>
              )}

              {/* Ciudades agrupadas por letra con diseño mejorado */}
              {groupedCities.map(({ letter, cities }) => (
                <CommandGroup key={letter}>
                  <div className="px-2 py-1 text-sm font-bold text-black bg-gray-200 uppercase">
                    {letter}
                  </div>
                  {cities.map((city) => (
                    <CommandItem
                      key={city.name}
                      value={city.name}
                      onSelect={handleCitySelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCity === city.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>

            {/* Search en la parte de abajo bien alineado */}
            <div className="relative p-2 border-t flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <CommandInput placeholder="Buscar ciudad..." className="w-full" />
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

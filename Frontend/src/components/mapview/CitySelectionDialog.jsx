
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { useFilteredCities } from "./hooks/useFilteredCities";
import { MapPin, Check } from "lucide-react";
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
import { useState } from "react";

// Componente de error integrado en el modal
function ErrorMessage({ message, imageSrc }) {
  return (
    <div className="flex flex-col items-center bg-green-100 text-green-900 p-3 rounded-md shadow-md mb-4">
      {imageSrc && <img src={imageSrc} alt="Error" className="mb-2 h-16" />}
      <p className="text-center text-sm font-medium">{message}</p>
    </div>
  );
}

export default function CitySelectionDialog({ open, onClose, map, onCitySelect, message, errorMessage, errorImage }) {
  const { priorityCities, groupedCities, loading } = useFilteredCities();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (value) => {
    setSelectedCity(value);
    setPopoverOpen(false);
    onCitySelect(value);

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="z-[9999]">
   {/*      <DialogTitle>Selecciona una Ciudad</DialogTitle> */}
        <DialogDescription>{message}</DialogDescription>

        {/* Mensaje de error dentro del modal */}
        {errorMessage && <ErrorMessage message={errorMessage} imageSrc={errorImage} />}

        {/* Selector de ciudades con Combobox */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={popoverOpen}
              className="flex items-center gap-2 w-full bg-gray-100 text-black rounded-lg px-4 py-3 shadow-md transition-all hover:bg-gray-200 focus:ring-2 focus:ring-gray-400"
            >
              <MapPin className="w-5 h-5" />
              {selectedCity || "Elige una ciudad"}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="center" className="w-full p-0 z-[9999]">

            <Command>
              <CommandList className="max-h-[240px] overflow-y-auto">
                <CommandEmpty>No se encontró ninguna ciudad.</CommandEmpty>

                {/* Ciudades recomendadas */}
                {priorityCities.length > 0 && (
                  <CommandGroup>
                    <div className="text-xs font-bold text-black bg-gray-300 px-2 py-1 ">
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

                {/* Ciudades agrupadas por letra */}
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
                <CommandInput placeholder="Buscar ciudad..." className="w-full" />
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={onClose} className="mt-4">
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

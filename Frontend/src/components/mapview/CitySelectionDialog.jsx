import {
  Dialog,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import { useFilteredCities } from './hooks/useFilteredCities';
import { MapPin, Check } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Componente de error integrado en el modal 
// parte verde
function ErrorMessage({ message, imageSrc }) {
  return (
    <div className='flex flex-col items-center p-3 rounded-md '>
      {imageSrc && <img src={imageSrc} alt='Error' className='mb-2 h-16' />}
      <p className='px-6 text-center text-[20x] font-medium'>{message}</p>
    </div>
  );
}

export default function CitySelectionDialog({
  open,
  onClose,
  map,
  onCitySelect,
  message,
  errorMessage,
  errorImage
}) {
  const { priorityCities, groupedCities, loading } = useFilteredCities();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = value => {
    setSelectedCity(value);
    setPopoverOpen(false);
    onCitySelect(value);

    if (map) {
      const city = [
        ...priorityCities,
        ...groupedCities.flatMap(group => group.cities)
      ].find(c => c.name === value);
      if (city) {
        map.flyTo([city.lat, city.lng], 12, { duration: 1.2 });
      }
    }
  };

  if (loading) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='z-[9999]'>
        {/*      <DialogTitle>Selecciona una Ciudad</DialogTitle> */}
        <DialogDescription>{message}</DialogDescription>

        {/* Mensaje de error dentro del modal */}
        {errorMessage && (
          <ErrorMessage message={errorMessage} imageSrc={errorImage} />
        )}

        {/* Selector de ciudades con Combobox */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='white'
              role='combobox'
              aria-expanded={popoverOpen}
              className='h-[48px] flex items-center gap-2 w-full bg-white text-black rounded-[16px] px-4 py-4 shadow-md'
            >
              <MapPin className='w-5 h-5' />
              {selectedCity || 'Elige una ciudad'}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side='bottom'
            align='center'
            sideOffset={8}
            avoidCollisions={false}
            className='w-[min(500px,90vw)] p-0 z-[9999] max-h-[65vh] overflow-y-auto'
          >
            <Command>
              <CommandList className='max-h-[180px] overflow-y-auto'>
                <CommandEmpty>No se encontró ninguna ciudad.</CommandEmpty>

                {/* Ciudades recomendadas */}
                {priorityCities.length > 0 && (
                  <CommandGroup>
                    <div className='text-xs font-bold text-black bg-gray-300 px-2 py-1 '>
                      🌎 Ciudades recomendadas
                    </div>
                    {priorityCities.map(city => (
                      <CommandItem
                        key={city.name}
                        value={city.name}
                        onSelect={handleCitySelect}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedCity === city.name
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {city.name}
                      </CommandItem>
                    ))}
                    <div className='h-[1px] w-full bg-gray-300 '></div>
                  </CommandGroup>
                )}

                {/* Ciudades agrupadas por letra */}
                {groupedCities.map(({ letter, cities }) => (
                  <CommandGroup key={letter}>
                    <div className='px-2 py-1 text-sm font-bold text-black bg-gray-200 uppercase'>
                      {letter}
                    </div>
                    {cities.map(city => (
                      <CommandItem
                        key={city.name}
                        value={city.name}
                        onSelect={handleCitySelect}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedCity === city.name
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {city.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>

              {/* Search en la parte de abajo bien alineado */}
              <div className='relative p-2 border-t flex items-center gap-2'>
                <CommandInput
                  placeholder='Buscar ciudad...'
                  className='w-full'
                />
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        <Button onClick={onClose} className='h-[48px] bg-[#222222] rounded-[16px]'>
          Cerrar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

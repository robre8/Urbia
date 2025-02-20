import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PropTypes from 'prop-types';
import { RiCrosshair2Line } from 'react-icons/ri';

export default function MyLocationButton({
  map,
  position,
  defaultZoom = 13,
  className = ''
}) {
  const handleClick = () => {
    if (map && position) {
      map.flyTo(position, defaultZoom, { duration: 1.2 });
    } else {
      alert('No se ha obtenido la ubicación o el mapa todavía.');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            className={` w-12 h-12 rounded-full 
              [box-shadow:0_0_10px_4px_rgba(155, 238, 94,0.5)]
              bg-white ${className}`}
            onClick={handleClick}
          >
            <RiCrosshair2Line className='text-xl' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Mostrar tu ubicación</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

MyLocationButton.propTypes = {
  map: PropTypes.object, // La instancia del mapa Leaflet (puede ser null)
  position: PropTypes.array, // [lat, lng] del usuario
  defaultZoom: PropTypes.number,
  className: PropTypes.string
};

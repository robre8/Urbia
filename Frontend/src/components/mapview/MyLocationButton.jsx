// MyLocationButton.jsx
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';
// Importamos el ícono desde react-icons/ri
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
    <Button
      variant='ghost'
      className={`flex items-center justify-center w-12 h-12 rounded-full 
              [box-shadow:0_0_10px_4px_rgba(146,173,69,0.5)]
              bg-white ${className}`}
      onClick={handleClick}
    >
      <RiCrosshair2Line className='text-xl' />
    </Button>
  );
}

MyLocationButton.propTypes = {
  map: PropTypes.object, // La instancia del mapa Leaflet (puede ser null)
  position: PropTypes.array, // [lat, lng] del usuario
  defaultZoom: PropTypes.number,
  className: PropTypes.string
};

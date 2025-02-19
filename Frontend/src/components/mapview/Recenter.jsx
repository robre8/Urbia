// Recenter.jsx
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

function Recenter({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
      map.invalidateSize(); // Recalcula el tamaño y recoloca los tiles
    }
  }, [center, zoom, map]);

  return null; // No renderiza nada en pantalla
}

export default Recenter;

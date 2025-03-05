import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';

export default function MapClickHandler() {
  const setSelectedCoords = useMapStore((state) => state.setSelectedCoords);

  useMapEvents({
    click(e) {
      // Filtramos si el evento es un doble clic
      if (e.originalEvent.detail === 2) return; // ⬅️ Evita capturar doble clic

      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      console.log('📍 Coordenadas seleccionadas:', coords);
      setSelectedCoords(coords);
    }
  });

  return null; // No renderiza nada, solo maneja eventos del mapa
}

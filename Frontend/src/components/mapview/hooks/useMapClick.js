import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';
import { toast } from "sonner";

export default function MapClickHandler() {
  const setSelectedCoords = useMapStore((state) => state.setSelectedCoords);

  useMapEvents({
    click(e) {
      // Filtramos si el evento es un doble clic
      if (e.originalEvent.detail === 2) return; // ⬅️ Evita capturar doble clic

      const coords = [e.latlng.lat, e.latlng.lng];
      console.log('📍 Coordenadas seleccionadas:', coords);
      
      // Store coordinates in the map store
      setSelectedCoords(coords);
      
      // Show toast with create report option
      toast("Estás a punto de crear un nuevo reporte en esta ubicación. ¿Deseas continuar?", {
        action: {
          label: "Crear reporte",
          onClick: () => {
            document.getElementById("open-report-form")?.click();
          }
        },
        cancel: {
          label: "Cancelar",
          onClick: () => {
            setSelectedCoords(null);
          }
        },
        duration: 10000,
        position: "bottom-center",
        className: "bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto"
      });
    }
  });

  return null;
}

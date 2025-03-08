import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';
import { toast } from "sonner";
import { useUserAuth } from '@/lib/store/useUserAuth';

export default function MapClickHandler() {
  const { user } = useUserAuth();
  const setSelectedCoords = useMapStore((state) => state.setSelectedCoords);

  useMapEvents({
    click(e) {
      // Skip if not logged in
      if (!user) return;
      
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
          },
          style: {
            backgroundColor: "#9bee5e",
            color: "#000000",
            fontWeight: "500",
            borderRadius: "4px",
            padding: "8px 16px"
          }
        },
        cancel: {
          label: "Cancelar",
          onClick: () => {
            setSelectedCoords(null);
          },
          style: {
            backgroundColor: "#222222",
            color: "#FFFFFF",
            fontWeight: "500",
            borderRadius: "4px",
            padding: "8px 16px"
          }
        },
        duration: 10000,
        position: "bottom-center",
        className: "p-4 bg-white rounded-xl shadow-lg max-w-md mx-auto"
      });
    }
  });

  return null;
}

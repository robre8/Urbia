import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';
import { toast } from "sonner";
import { ReportLocationToast } from './ReportLocationToast';

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
      
      // Show toast with ReportLocationToast component
      toast(
        <ReportLocationToast 
          onCreateReport={() => document.getElementById("open-report-form")?.click()}
          onCancel={() => setSelectedCoords(null)}
        />,
        {
          duration: 10000,
          position: "bottom-center",
          className: "p-0 bg-white rounded-xl shadow-lg max-w-md mx-auto",
          closeButton: false
        }
      );
    }
  });

  return null;
}
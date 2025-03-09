import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';
import { toast } from "sonner";
import { ReportLocationToast } from './ReportLocationToast';

// Track if a toast is currently active
let isToastActive = false;

export default function MapClickHandler() {
  const setSelectedCoords = useMapStore((state) => state.setSelectedCoords);

  useMapEvents({
    click(e) {
      // Filtramos si el evento es un doble clic
      if (e.originalEvent.detail === 2) return; // ⬅️ Evita capturar doble clic

      // If a toast is already active, don't show another one
      if (isToastActive) {
        console.log('Toast already active, ignoring map click');
        return;
      }

      const coords = [e.latlng.lat, e.latlng.lng];
      console.log('📍 Coordenadas seleccionadas:', coords);
      
      // Store coordinates in the map store
      setSelectedCoords(coords);
      
      // Set toast as active
      isToastActive = true;
      
      // Show toast with ReportLocationToast component
      toast(
        <ReportLocationToast 
          onCreateReport={() => {
            isToastActive = false;
            document.getElementById("open-report-form")?.click();
          }}
          onCancel={() => {
            isToastActive = false;
            setSelectedCoords(null);
          }}
        />,
        {
          duration: 8000,
          position: "bottom-center",
          className: "p-0 bg-white rounded-xl shadow-lg mx-auto", 
          style: {
            width: "min(90vw, 600px)",
            maxWidth: "600px",
            left: "50%",
            transform: "translateX(-50%)",
            margin: "0 auto"
          },
          closeButton: false,
          onDismiss: () => {
            // Reset the toast active state when dismissed
            isToastActive = false;
          }
        }
      );
    }
  });

  return null;
}
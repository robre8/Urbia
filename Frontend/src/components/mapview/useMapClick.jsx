import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';
import { toast } from "sonner";
import { ReportLocationToast } from './ReportLocationToast';
import { useEffect } from 'react';
import { useUserAuth } from '@/lib/store/useUserAuth'; // Add this import

// Track if a toast is currently active
let isToastActive = false;

export default function MapClickHandler() {
  const setSelectedCoords = useMapStore((state) => state.setSelectedCoords);
  const { user } = useUserAuth(); // Get user authentication status

  // Add cleanup effect to ensure isToastActive is reset if component unmounts
  useEffect(() => {
    return () => {
      isToastActive = false;
    };
  }, []);

  useMapEvents({
    click(e) {
      // Skip if user is not logged in
      if (!user) return;
      
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
      
      // Create a timeout to reset isToastActive after toast duration
      const toastTimeout = setTimeout(() => {
        isToastActive = false;
        setSelectedCoords(null); // Add this line to remove marker when timeout occurs
        console.log('Toast timeout reached, resetting active state');
      }, 8500); // Slightly longer than toast duration to ensure it completes
      
      // Show toast with ReportLocationToast component
      toast(
        <ReportLocationToast 
          onCreateReport={() => {
            clearTimeout(toastTimeout); // Clear the timeout
            isToastActive = false;
            document.getElementById("open-report-form")?.click();
          }}
          onCancel={() => {
            clearTimeout(toastTimeout); // Clear the timeout
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
            clearTimeout(toastTimeout); // Clear the timeout
            isToastActive = false;
            setSelectedCoords(null); // Also remove marker when toast is dismissed
            console.log('Toast dismissed, resetting active state');
          }
        }
      );
    }
  });

  return null;
}
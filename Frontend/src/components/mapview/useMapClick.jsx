import { useMapEvents } from 'react-leaflet';
import useMapStore from '@/lib/store/useMapStore';
import { toast } from "sonner";
import { ReportLocationToast } from './ReportLocationToast';
import { useEffect, useRef } from 'react';
import { useUserAuth } from '@/lib/store/useUserAuth';
import frogError from "@/assets/frogError.png"; // Import the frog error image

// Track if a toast is currently active
let isToastActive = false;

export default function MapClickHandler() {
  const setSelectedCoords = useMapStore((state) => state.setSelectedCoords);
  const { user } = useUserAuth(); // Get user authentication status
  const prevUserRef = useRef(null);

  // Add cleanup effect to ensure isToastActive is reset if component unmounts
  useEffect(() => {
    return () => {
      isToastActive = false;
    };
  }, []);

  // Track user login state changes to prevent duplicate toasts
  useEffect(() => {
    prevUserRef.current = user;
  }, [user]);

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
      
      // Check if user is logged in
      if (!user) {
        // User is not logged in, show login required toast
        isToastActive = true;
        
        // Create a timeout to reset isToastActive after toast duration
        const toastTimeout = setTimeout(() => {
          isToastActive = false;
          console.log('Toast timeout reached, resetting active state');
        }, 5500);
        
        toast(
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="flex-shrink-0 w-32 flex justify-center">
              <img src={frogError} alt="Frog" className="h-28 w-auto object-contain" />
            </div>
            <div className="text-center sm:text-left">
              ¡No tan rápido renacuajo! primero debes <strong>iniciar sesión</strong> para empezar a crear reportes.
            </div>
          </div>,
          {
            duration: 5000,
            position: "bottom-center",
            className: "p-4 bg-white rounded-xl shadow-lg mx-auto",
            style: { 
              width: "min(90vw, 600px)",
              maxWidth: "600px",
              left: "50%",
              transform: "translateX(-50%)",
              margin: "0 auto"
            },
            onDismiss: () => {
              clearTimeout(toastTimeout);
              isToastActive = false;
            }
          }
        );
        return;
      }
      
      // User is logged in, continue with normal flow
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
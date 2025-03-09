import { useState, useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
// Remove this import since we're getting address from props
// import { useReverseGeocode } from '@/components/mapview/hooks/useReverseGeocode';
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReportMarker from "@/components/mapview/ReportMarker";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Better to define constants outside the component
const CATEGORY_DEFAULT = { id: 99, nombre: 'default' };

// Add address and loadingAddress to props
const ConfirmReport = ({ open, setOpen, setOpenParent, setIsConfirm, address, loadingAddress }) => {
  const { categories } = useCategoryStore();
  const { reportPreview, clearReportPreview } = useReportsStore();   
  const [currentCategory, setCurrentCategory] = useState({});
  
  // Use the coordinates from reportPreview
  const coordinates = reportPreview ? [reportPreview.latitud, reportPreview.longitud] : null;
  
  // Remove the useReverseGeocode hook call since we're getting address from props
  // const { address, loadingAddress, error } = useReverseGeocode(coordinates);
  
  // Add debug logging to see what's happening
  useEffect(() => {
    if (reportPreview) {
      console.log("Coordinates for geocoding:", coordinates);
      console.log("Address result:", { address, loadingAddress });
    }
  }, [reportPreview, coordinates, address, loadingAddress]);
  
  const handleConfirm = (e) => {
    e.preventDefault();
    setOpen(false);
    setOpenParent(false);
    clearReportPreview();    
    setIsConfirm(false);
  };
  
  const handleGoBack = () => {
    setOpen(false);
  };

  useEffect(() => {
    setCurrentCategory(
      categories.find(
        cat => cat.id === parseInt(reportPreview?.categoriaId)
      ) || CATEGORY_DEFAULT
    );
  }, [categories, reportPreview]);
  
  // Check if we have an image to display
  const hasImage = reportPreview?.urlImagen && reportPreview.urlImagen.trim().length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>                     
      <SheetContent className="overflow-y-auto px-4 flex flex-col gap-2">
        
          <SheetHeader className="space-y-2">
            <SheetTitle className="text-2xl font-bold text-gray-900 p-4">
              Reportar incidente
            </SheetTitle>
            <SheetDescription>
              {/* Empty SheetDescription - consider removing if not used */}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-3">
            {/* Imagen o Mapa */}
            <div className="grid gap-3">
              <Label htmlFor="imagen" className="font-semibold">
                Imagen
              </Label>
              {hasImage ? (
                <img 
                  src={reportPreview.urlImagen}
                  className='w-full h-32 bg-slate-200 object-cover rounded-xl'
                  alt="Vista previa de la Imagen del reporte" 
                />
              ) : (
                coordinates && coordinates[0] && coordinates[1] && (
                  <div className="w-full h-32 rounded-xl overflow-hidden">
                    <MapContainer
                      center={coordinates}
                      zoom={15}
                      scrollWheelZoom={false}
                      dragging={false}
                      doubleClickZoom={false}
                      touchZoom={false}
                      zoomControl={false}
                      style={{ pointerEvents: "none", height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        maxZoom={20}
                      />
                      {reportPreview && (
                        <ReportMarker 
                          reports={[{...reportPreview, latitud: coordinates[0], longitud: coordinates[1]}]} 
                          size={[30, 30]} 
                        />
                      )}
                    </MapContainer>
                  </div>
                )
              )}              
            </div>

            {/* Rest of the component remains the same */}
            {/* Categoría */}
            <div className="grid gap-2">
              <h3 className="font-semibold text-md">
                Categoría 
              </h3>              
              <p className="text-sm">
                {currentCategory.nombre}
              </p>
            </div>

            {/* Dirección */}
            <div className="grid gap-2">
              <h3 className="text-md font-semibold">
                Dirección
              </h3>              
              <p className="text-sm">
                {address}
              </p>
            </div>

            {/* Rest of the component remains unchanged */}
            {/* Título */}
            <div className="grid gap-2">
              <h3 className="text-md font-semibold">
                Título 
              </h3>
              <p className="text-sm">
                {reportPreview.titulo} 
              </p>
              
             
            </div>

            {/* Descripción */}
            <div className="grid gap-1">
              <h3  className="font-semibold text-md">
                Descripción
              </h3>
              <p  className="text-xs max-h-[120px] overflow-auto">
                {reportPreview.descripcionDespuesDeIa}
              </p>              
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <Button  
              onClick={handleConfirm}
              className={'w-full rounded-[10px] gap-2 bg-lime-300 text-black hover:bg-lime-400 '}
            >
              Reportar
            </Button>
            <Button  
              type="button"
              className="hover:bg-gray-500 w-full rounded-[10px]"
              onClick={handleGoBack}
            >
              Volver
            </Button>
          </div>
        
      </SheetContent>        
      
    </Sheet>
  );
};

export default ConfirmReport;

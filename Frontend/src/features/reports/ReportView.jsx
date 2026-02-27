import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { User, ArrowLeft, BadgeCheck } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReportMarker from "@/components/mapview/ReportMarker";
import UrbiaLikes from "./UrbiaLikes";
import ReportActions from "./ReportActions";
import deleteAlert from "@/components/alerts/deleteAlerts/DeleteAlert";
import useReportsStore from "@/lib/store/useReportsStore";
import { useUserAuth } from "@/lib/store/useUserAuth"; // Add this import

// Updated category mapping to match backend category IDs
const categoryMapping = {
  1: "Salud",               // ID 1 = Salud
  2: "Infraestructura",     // ID 2 = Infraestructura
  3: "Seguridad",           // ID 3 = Seguridad
  4: "Eventos Sociales",    // ID 4 = Eventos Sociales
};

export default function ReportView({ report, onClose, deleteReport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const { user } = useUserAuth(); // Get the current logged-in user
  
  // Get the setReportPreview function from the store
  
  useEffect(() => {
    if (report) {
      setCurrentReport(report);
      setIsOpen(true);
    }
  }, [report]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        onClose();
      }, 300);
    }
  };

  if (!currentReport) return null;

  const hasImage =
    currentReport.urlImagen && currentReport.urlImagen.trim().length > 0;

  const handleDelete = () => {
    // First close the sheet
    handleOpenChange(false);
    
    // Show delete confirmation after sheet closes
    setTimeout(() => {
      deleteAlert(currentReport.id, (deletedId) => {
        if (typeof deleteReport === 'function') {
          deleteReport(deletedId);
          // Ensure onClose is called after deletion
          onClose();
        }
      });
    }, 300);
  };

  const handleEdit = () => {
    // First close the sheet
    handleOpenChange(false);
    
    // Set the report in the store for editing
    setTimeout(() => {
      // Make a clean copy of the current report to avoid reference issues
      const reportForEdit = {
        ...currentReport,
        // Ensure these fields are properly set for editing
        id: currentReport.id,
        titulo: currentReport.titulo,
        descripcion: currentReport.descripcionDespuesDeIa || currentReport.descripcion,
        categoriaId: currentReport.categoriaId,
        latitud: currentReport.latitud,
        longitud: currentReport.longitud,
        usuarioId: currentReport.usuarioId
      };
      
      // Update the store with the current report
      useReportsStore.setState({ 
        reportPreview: reportForEdit,
        isEditMode: true,  // Add a flag in the store to indicate edit mode
        editSource: 'reportView', // Add this to indicate the edit is from ReportView
        preserveReportId: currentReport.id  // Add this to track which report is being edited
      });
      
      // Open the report form
      const formTrigger = document.getElementById("open-report-form");
      if (formTrigger) {
        formTrigger.click();
      }
    }, 300);
  };

  // Check if the current user is the owner of the report
  const isReportOwner =
    user &&
    currentReport &&
    Number(user.id) > 0 &&
    Number(currentReport.usuarioId) > 0 &&
    Number(user.id) === Number(currentReport.usuarioId);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="w-full md:w-[450px] p-0">
          {/* ✅ Barra superior con título, botón de cerrar y acciones */}
          <div className="flex items-center justify-between border-b py-3 px-4">
            <button
              onClick={() => handleOpenChange(false)}
              className=" text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <SheetHeader className="flex-1 text-center">
              <div className="flex items-center justify-between px-2">

              <SheetTitle className="text-lg font-semibold">Incidente</SheetTitle>
            {/* Only show ReportActions if the user is the owner of the report */}
            {isReportOwner && (
              <ReportActions
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
              </div>
            </SheetHeader>
          </div>

          <Card className="mx-4 shadow-none border-none">
            <CardContent className="p-0">
              <div className="flex items-center justify-between py-2">
                <h1 className="text-md  font-semibold">{currentReport.titulo}</h1>
                <BadgeCheck />
              </div>
              <p className="text-sm text-gray-500 py-2">
                {categoryMapping[currentReport.categoriaId]}
              </p>
              {hasImage ? (
                <img
                  src={currentReport.urlImagen}
                  alt="Imagen del reporte"
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => {
                    console.log("Image clicked, showing preview");
                    setIsOpen(false); // Close the sheet
                    setTimeout(() => {
                      setShowImagePreview(true); // Show image preview after sheet closes
                    }, 300);
                  }}
                />
              ) : (
                <div className="w-full h-40 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[currentReport.latitud, currentReport.longitud]}
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
                    <ReportMarker reports={[currentReport]} size={[30, 30]} />
                  </MapContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-2 px-4 flex items-center justify-between text-gray-500 text-sm">
            <UrbiaLikes />
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{currentReport.nombreUsuario}</span>
            </div>
          </div>

          <div className="mt-4 px-4">
            <h3 className="text-lg font-semibold">Descripción del incidente</h3>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line max-h-[270px] overflow-auto">
              {currentReport.descripcionDespuesDeIa}
            </p>
          </div>

          {hasImage && (
            <div className="mt-6 px-4">
              <div className="mt-2 w-full h-32 rounded-lg overflow-hidden">
                <MapContainer
                  center={[currentReport.latitud, currentReport.longitud]}
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
                  <ReportMarker reports={[currentReport]} size={[30, 30]} />
                </MapContainer>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4 px-4">
            {currentReport.createdAt ? new Date(currentReport.createdAt).toLocaleString('es-ES') : 'Fecha no disponible'}
          </p>
        </SheetContent>
      </Sheet>

      {/* Image Preview Modal */}
      {showImagePreview && hasImage && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center p-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => {
            setShowImagePreview(false);
            setTimeout(() => {
              setIsOpen(true); // Reopen the sheet after closing the preview
            }, 100);
          }}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={currentReport.urlImagen}
              alt="Vista ampliada"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

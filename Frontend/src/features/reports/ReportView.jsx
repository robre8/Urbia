import { useState, useEffect } from "react";
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
import ReportActions from "./ReportActions"; // ✅ Importamos el nuevo componente
import deleteAlert from "@/components/alerts/deleteAlerts/DeleteAlert";

const categoryMapping = {
  1: "Infraestructura",
  2: "Seguridad",
  3: "Salud",
  4: "Eventos Sociales",
};

export default function ReportView({ report, onClose, deleteReport }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
console.log(report);
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
      deleteAlert(currentReport.id, (deletedId) => {
        deleteReport(deletedId);
        handleOpenChange(false); // ✅ Cierra el Sheet solo si el usuario confirma la eliminación
      });
    };

  return (
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
          {/* ✅ Botón de acciones (Editar/Eliminar) */}
          <ReportActions
            onEdit={() => console.log(`Editar reporte ${currentReport.id}`)}
            onDelete={handleDelete}
          />
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
                className="w-full h-48 object-cover rounded-lg"
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
                    attribution="© OpenStreetMap contributors © CARTO"
                    maxZoom={20}
                  />
                  <ReportMarker report={currentReport} />
                </MapContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-2 px-4 flex items-center justify-between text-gray-500 text-sm">
          <UrbiaLikes />
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{currentReport.nombreUsuario}</span>
          </div>
        </div>

        <div className="mt-4 px-4">
          <h3 className="text-lg font-semibold">Descripción del incidente</h3>
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
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
                  attribution="© OpenStreetMap contributors © CARTO"
                  maxZoom={20}
                />
                <ReportMarker report={currentReport} size={[30, 30]} />
              </MapContainer>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 px-4">
          {new Date(currentReport.fechaHora).toLocaleString()}
        </p>
      </SheetContent>
    </Sheet>
  );
}

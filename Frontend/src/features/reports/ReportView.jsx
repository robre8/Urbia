import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
  } from '@/components/ui/sheet';
  import { Card, CardContent } from '@/components/ui/card';
  import { User, ThumbsUp, ArrowLeft } from 'lucide-react';
  import { MapContainer, TileLayer } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css';
import ReportMarker from '@/components/mapview/ReportMarker';
import { BadgeCheck } from 'lucide-react';
  
  const categoryMapping = {
    1: 'Infraestructura',
    2: 'Seguridad',
    3: 'Salud',
    4: 'Eventos Sociales'
  };
  
  const ReportView = ({ report, onClose }) => {
    if (!report) return null;
  
    const hasImage = report.urlImagen && report.urlImagen.trim().length > 0;
  
    return (
      <Sheet open={!!report} onOpenChange={onClose}>
        <SheetContent className="w-full md:w-[450px] p-0">
          <div className="flex items-center border-b py-3">
            <button onClick={onClose} className="p-2 text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Incidente</SheetTitle>
            </SheetHeader>
          </div>
          <Card className=" mx-4 shadow-none border-none">
            <CardContent className="p-0">
                <div className='flex items-center justify-between py-1'>

              <h1 className='text-md font-semibold'>{report.titulo}</h1>
              <BadgeCheck />
                </div>
              <p className="text-sm text-gray-500 py-2">
                {categoryMapping[report.categoriaId]}
              </p>
              {hasImage ? (
                <img
                  src={report.urlImagen}
                  alt="Imagen del reporte"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-40 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[report.latitud, report.longitud]}
                    zoom={15}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    zoomControl={false}
                    style={{ pointerEvents: 'none', height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution="© OpenStreetMap contributors © CARTO"
                      maxZoom={20}
                    />
                    <ReportMarker report={report} />
                  </MapContainer>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="mt-2 px-4 flex items-center justify-between text-gray-500 text-sm">
            <button className="flex items-center text-gray-700">
              <ThumbsUp className="w-4 h-4 mr-1" />
              Recomendar
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{report.name}</span>
            </div>
          </div>
          <div className="mt-4 px-4">
            <h3 className="text-lg font-semibold">Descripción del incidente</h3>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
              {report.descripcionDespuesDeIa}
            </p>
          </div>
          {hasImage && (
            <div className="mt-6 px-4">

              <div className="mt-2 w-full h-32 rounded-lg overflow-hidden">
                <MapContainer
                  center={[report.latitud, report.longitud]}
                  zoom={15}
                  scrollWheelZoom={false}
                  dragging={false}
                  doubleClickZoom={false}
                  touchZoom={false}
                  zoomControl={false}
                  style={{ pointerEvents: 'none', height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="© OpenStreetMap contributors © CARTO"
                    maxZoom={20}
                  />
                  <ReportMarker report={report} size={[30, 30]} />
                </MapContainer>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-4 px-4">
            {new Date(report.fechaHora).toLocaleString()}
          </p>
        </SheetContent>
      </Sheet>
    );
  };
  
  export default ReportView;
  
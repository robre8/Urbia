import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";

import { useUserLocation } from "./hooks/useUserLocation";
import { useReverseGeocode } from "./hooks/useReverseGeocode";
import { useUserAuth } from "@/lib/store/useUserAuth";
import { useCities } from "./hooks/useCities";
import { getGeolocationErrorMessage } from "@/lib/utils/errorMessages";
import useCategoryStore from "@/lib/store/useCategoryStore";
import useMapStore from "@/lib/store/useMapStore";
import useReportsStore from "@/lib/store/useReportsStore";

import ReportMarker from "./ReportMarker";
import Recenter from "./Recenter";
import MyLocationButton from "./MyLocationButton";
import MapClickHandler from "./hooks/useMapClick";
import ReportView from "@/features/reports/ReportView";
import CitySelectionDialog from "./CitySelectionDialog";
import CityNavigation from "./CityNavigation";
import UserMenu from "@/features/auth/MenuUser";
import UserLogin from "@/features/auth/UserLogin";
import InstallPWAButton from "./AddPWAButton";
import { AddressCard } from "../Adress/AdressCard";
import CleanReportForm from "@/features/reports/form/CleanReportForm";

import userIcon from "/frogIco.png";
import sadFrog from "@/assets/frogError.png";

import "./style/MapView.css";
import { AnimatedCircle } from "./AnimatedCircle";

const wazeIcon = L.icon({
  iconUrl: userIcon,
  iconSize: [30, 30],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

const categoryMapping = {
  1: "infraestructura",
  2: "seguridad",
  3: "salud",
  4: "eventosSociales"
};

export default function MapView() {
  const { groupedReports } = useReportsStore();
  const { toggles } = useCategoryStore();

  const { center, position, error, loading, geolocationStatus } =
    useUserLocation([-34.6037, -58.3816]);
  const defaultZoom = 18;
  const [map, setMap] = useState(null);

  const { user } = useUserAuth();
  const { address, loadingAddress, error: addressError } =
    useReverseGeocode(position);
  const { cities } = useCities();
  const [modalOpen, setModalOpen] = useState(false);
  const modalHasBeenOpened = useRef(false);

  const { selectedCoords, loadStoredCoords } = useMapStore();

  // Estado para manejar el reporte seleccionado y abrir ReportView
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadStoredCoords();
  }, [loadStoredCoords]);

  useEffect(() => {
    if (
      !loading &&
      ["browser_denied", "ip_error_default", "timeout_default"].includes(
        geolocationStatus
      ) &&
      !modalHasBeenOpened.current
    ) {
      setModalOpen(true);
      modalHasBeenOpened.current = true;
    }
  }, [loading, geolocationStatus]);

  const handleCitySelect = (cityName) => {
    const city = cities.find((c) => c.name === cityName);
    if (city && map) {
      map.setView([city.lat, city.lng], defaultZoom);
      setModalOpen(false);
    }
  };

  const errorMessage = getGeolocationErrorMessage(geolocationStatus, error);

  return (
    <div className="relative w-full h-screen">
      <Toaster position="bottom-center" />
      
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
        whenReady={(event) => setMap(event.target)}
        minZoom={4}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />

        <ZoomControl position="bottomright" />
        <Recenter center={center} zoom={defaultZoom} />
        <MapClickHandler />

        {/* Marcador ubicación del usuario */}
        {!error && position && (
          <>
            <Marker position={position} icon={wazeIcon} />
            <AnimatedCircle
              center={position}
              initialRadius={80}
              maxRadius={120}
              duration={2000} // Duración en milisegundos del ciclo de expansión
              pathOptions={{
                color: "blue",
                fillColor: "blue",
                stroke: false
              }}
            />
          </>
        )}

        {/* Marcador de click en el mapa */}
        {selectedCoords && <Marker position={selectedCoords} />}

        {/* Render de reportes agrupados */}
        {Object.values(groupedReports).map((group, index) => {
          if (!Array.isArray(group) || group.length === 0) return null;
          const catKey = categoryMapping[group[0]?.categoriaId];
          if (!toggles[catKey]) return null;

          return (
            <ReportMarker
              key={index}
              reports={group}
              // Al hacer clic en un reporte, se abre el detalle
              onReportSelect={(report) => setSelectedReport(report)}
            />
          );
        })}
      </MapContainer>

      <MyLocationButton
        map={map}
        position={position}
        defaultZoom={defaultZoom}
        className="absolute bottom-10 lg:bottom-32 right-7 z-[9999]"
      />

      {position && (address || loadingAddress || addressError) && (
        <div className="hidden md:block overflow-hidden absolute bottom-5 left-20 z-[9999]">
          <AddressCard
            address={address}
            loadingAddress={loadingAddress}
            addressError={addressError}
          />
        </div>
      )}

      <div className="absolute top-5 right-5 z-[9999] flex items-center gap-4">
        <InstallPWAButton />
        <div className="hidden lg:flex">
          {user ? <UserMenu /> : <UserLogin />}
        </div>
      </div>

      {modalOpen && (
        <CitySelectionDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          cities={cities}
          map={map}
          onCitySelect={handleCitySelect}
          message=""
          errorMessage={errorMessage}
          errorImage={sadFrog}
        />
      )}

      <CityNavigation map={map} />

      {/* Hidden button to trigger the report form */}
      <button 
        id="open-report-form" 
        className="hidden" 
        aria-hidden="true"
      />

      {/* ReportView se abre cuando seleccionamos un reporte */}
      {selectedReport && (
        <ReportView
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
      
      {/* Clean Report Form */}
      <CleanReportForm />
    </div>
  );
}

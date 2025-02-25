// MapView.jsx
import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import ReportMarker from "./ReportMarker";
import Recenter from "./Recenter";
import userIcon from "@/assets/userIcon.png";
import sadFrog from "@/assets/sadFrog.png";
import { useUserLocation } from "./hooks/useUserLocation";
import { useReverseGeocode } from "./hooks/useReverseGeocode";
import MyLocationButton from "./MyLocationButton";
import "./style/MapView.css";
import { AddressCard } from "../Adress/AdressCard";
import { ErrorMessage } from "../ui/ErrorMessage";
import UserLogin from "@/features/auth/UserLogin";
import { useUserAuth } from "@/lib/store/useUserAuth";
import UserMenu from "@/features/auth/MenuUser";
import CityNavigation from "./CityNavigation";

// Importamos el modal de selección de ciudad y el hook para obtener ciudades desde OSM
import CitySelectionDialog from "./CitySelectionDialog";
import { useCities } from "./hooks/useCities";

const wazeIcon = L.icon({
  iconUrl: userIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

export default function MapView({ reports }) {
  const { center, position, accuracy, error, loading, geolocationStatus } = useUserLocation([15.977, -97.696]);
  const defaultZoom = 18;
  const [map, setMap] = useState(null);

  const { user } = useUserAuth();
  const { address, loadingAddress, error: addressError } = useReverseGeocode(position);

  const { cities } = useCities();
  const [modalOpen, setModalOpen] = useState(false);
  const modalHasBeenOpened = useRef(false);
  const geolocationNotPrecise = (status) => {
    return status === "browser_denied" || status === "ip_error_default" || status === "timeout_default";
  };

  useEffect(() => {
    if (!loading && geolocationNotPrecise(geolocationStatus) && !modalHasBeenOpened.current) {
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

  let errorMessage = null;
  if (error) {
    if (geolocationStatus === "browser_denied") {
      errorMessage = "Permiso de ubicación denegado. Habilita la ubicación en tu navegador para una mejor experiencia.";
    } else if (
      geolocationStatus === "browser_unavailable" ||
      geolocationStatus === "browser_timeout" ||
      geolocationStatus === "ip_error_default" ||
      geolocationStatus === "timeout_default"
    ) {
      errorMessage = "No se pudo obtener tu ubicación precisa. Mostrando ubicación aproximada o por defecto.";
    } else if (geolocationStatus === "unsupported") {
      errorMessage = "Tu navegador no soporta geolocalización. Usando ubicación por defecto.";
    } else {
      errorMessage = "Error al obtener ubicación: " + error;
    }
  }

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
        whenReady={(event) => {
          setMap(event.target);
        }}
        minZoom={4}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap contributors © CARTO"
          maxZoom={20}
        />

        <ZoomControl position="bottomright" />
        <Recenter center={center} zoom={defaultZoom} />

        {errorMessage && <ErrorMessage message={errorMessage} imageSrc={sadFrog} />}

        {!error && position && (
          <>
            <Marker position={position} icon={wazeIcon}>
              <Popup>Tú estás aquí</Popup>
            </Marker>
            <Circle
              center={position}
              radius={accuracy || 5}
              pathOptions={{
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.2,
                stroke: false,
              }}
            />
          </>
        )}

        {reports.map((report, i) => (
          <ReportMarker key={i} report={report} />
        ))}
      </MapContainer>

      <MyLocationButton map={map} position={position} defaultZoom={defaultZoom} className="absolute bottom-36 lg:bottom-28 right-7 z-[9999]" />

      <div className="hidden md:block overflow-hidden absolute top-5 left-24 z-[9999]">
        <AddressCard address={address} loadingAddress={loadingAddress} addressError={addressError} />
      </div>
      <div className="absolute top-5 right-5 z-[9999]">{user ? <UserMenu /> : <UserLogin />}</div>

      {/* Renderizamos el modal solo si modalOpen es true */}
      {modalOpen && (
        <CitySelectionDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          cities={cities}
          onCitySelect={handleCitySelect}
          message="No se pudo obtener una ubicación precisa. Selecciona tu ciudad:"
        />
      )}

<CityNavigation map={map} />
    </div>
  );
}

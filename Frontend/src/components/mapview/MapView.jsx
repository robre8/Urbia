// MapView.jsx
import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
  Circle
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import ReportMarker from './ReportMarker';
import Recenter from './Recenter';
import userIcon from '@/assets/userIcon.png';
import { useUserLocation } from './hooks/useUserLocation';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import MyLocationButton from './MyLocationButton';
import './style/MapView.css';
import { AddressCard } from '../Adress/AdressCard';

const wazeIcon = L.icon({
  iconUrl: userIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

export default function MapView({ reports }) {
  const { center, position, accuracy, error, loading, geolocationStatus } = useUserLocation([-34.6037, -58.3816]);
  const defaultZoom = 18;
  const [map, setMap] = useState(null);

  const {
    address,
    loadingAddress,
    error: addressError
  } = useReverseGeocode(position);

  // Dynamic loading message based on geolocationStatus
  let loadingMessage = "Cargando ubicación...";
  if (geolocationStatus === 'google_api_attempt') {
    loadingMessage = "Refinando ubicación con Google API...";
  } else if (geolocationStatus === 'ip_fallback' || geolocationStatus === 'ip_error_default') {
    loadingMessage = "Obteniendo ubicación aproximada por IP...";
  }

  // Dynamic error message based on geolocationStatus and error
  let errorMessage = null;
  if (error) {
    if (geolocationStatus === 'browser_denied') {
      errorMessage = "Permiso de ubicación denegado. Habilita la ubicación en tu navegador para una mejor experiencia.";
    } else if (geolocationStatus === 'browser_unavailable' || geolocationStatus === 'browser_timeout' || geolocationStatus === 'ip_error_default' || geolocationStatus === 'timeout_default') {
      errorMessage = "No se pudo obtener tu ubicación precisa. Mostrando ubicación aproximada o por defecto.";
    } else if (geolocationStatus === 'unsupported') {
      errorMessage = "Tu navegador no soporta geolocalización. Usando ubicación por defecto.";
    } else {
      errorMessage = "Error al obtener ubicación: " + error;
    }
  }

  if (loading) {
    return <div className="p-4">{loadingMessage}</div>;
  }

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className="w-full h-full"
        zoomControl={false}
        whenReady={(event) => {
          const mapInstance = event.target;
          setMap(mapInstance);
        }}
        minZoom={4}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='© OpenStreetMap contributors © CARTO'
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        <Recenter center={center} zoom={defaultZoom} />

        {errorMessage && (
          <div className="absolute top-5 left-5 z-[9999] bg-red-500 text-white p-2 rounded shadow-md">
            {errorMessage}
          </div>
        )}

        {!error && position && (
          <>
            <Marker position={position} icon={wazeIcon}>
              <Popup>Tú estás aquí</Popup>
            </Marker>
            <Circle
              center={position}
              radius={accuracy || 5}
              pathOptions={{
                color: 'blue',
                fillColor: 'blue',
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

      <MyLocationButton
        map={map}
        position={position}
        defaultZoom={defaultZoom}
        className="absolute bottom-28 right-5 z-[9999]"
      />

      <div className="absolute top-5 left-24 z-[9999]">
        <AddressCard
          address={address}
          loadingAddress={loadingAddress}
          addressError={addressError}
        />
      </div>
    </div>
  );
}
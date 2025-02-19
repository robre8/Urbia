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
import MyLocationButton from './MyLocationButton'; 
import './style/MapView.css'

const wazeIcon = L.icon({
  iconUrl: userIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

export default function MapView({ reports }) {
  const { center, position, accuracy, error, loading } = useUserLocation([-34.6037, -58.3816]);
  const defaultZoom = 18;

  const [map, setMap] = useState(null);

  if (loading) {
    return <div className="p-4">Cargando ubicación...</div>;
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
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          maxZoom={20}
        />
        <ZoomControl position="bottomright"/>
        <Recenter center={center} zoom={defaultZoom} />

        {!error && position && (
          <>
            <Marker position={position} icon={wazeIcon}>
              <Popup>Tú estás aquí</Popup>
            </Marker>
            <Circle
              center={position}
              radius={accuracy || 50}
              pathOptions={{
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.2,
                stroke: false
              }}
            />
          </>
        )}

        {reports.map((report, i) => (
          <ReportMarker key={i} report={report} />
        ))}
      </MapContainer>

      {/* Aquí usamos el botón flotante como componente aparte */}
      <MyLocationButton
        map={map}
        position={position}
        defaultZoom={defaultZoom}
        className="absolute bottom-28 right-5 z-[9999]"
      />
    </div>
  );
}

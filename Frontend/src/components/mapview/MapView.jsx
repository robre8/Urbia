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
import { useReverseGeocode } from './hooks/useReverseGeocode'; // <-- Importas tu nuevo hook
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
  const { center, position, accuracy, error, loading } = useUserLocation([-34.6037, -58.3816]);
  const defaultZoom = 18;
  const [map, setMap] = useState(null);

  // Aquí usamos el hook de reverse geocode SOLO UNA VEZ,
  // pasándole la misma "position" que ya tenemos
  const {
    address,
    loadingAddress,
    error: addressError
  } = useReverseGeocode(position);

  if (loading) {
    return <div className="p-4">Cargando ubicación...</div>;
  }
  console.log(accuracy)
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
              radius={accuracy || 5}
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

      <MyLocationButton
        map={map}
        position={position}
        defaultZoom={defaultZoom}
        className="absolute bottom-28 right-5 z-[9999]"
      />

      {/* Pasamos la dirección y estados de loading/error a AddressCard */}
      <div className='absolute top-5 left-24 z-[9999]'>

      <AddressCard
        address={address}
        loadingAddress={loadingAddress}
        addressError={addressError}
      />
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
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
import userIcon from '/frogIco.png';
import sadFrog from '@/assets/frogError.png';
import { useUserLocation } from './hooks/useUserLocation';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import MyLocationButton from './MyLocationButton';
import './style/MapView.css';
import { AddressCard } from '../Adress/AdressCard';
import UserLogin from '@/features/auth/UserLogin';
import { useUserAuth } from '@/lib/store/useUserAuth';
import UserMenu from '@/features/auth/MenuUser';
import CityNavigation from './CityNavigation';
import CitySelectionDialog from './CitySelectionDialog';
import { useCities } from './hooks/useCities';
import { getGeolocationErrorMessage } from '@/lib/utils/errorMessages';
import InstallPWAButton from './AddPWAButton';
import useCategoryStore from '@/lib/store/useCategoryStore';

const wazeIcon = L.icon({
  iconUrl: userIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

const categoryMapping = {
  1: 'infraestructura',
  2: 'seguridad',
  3: 'salud',
  4: 'eventosSociales'
};

export default function MapView({ reports }) {
  const { center, position, error, loading, geolocationStatus } =
    useUserLocation([15.977, -97.696]);
  const defaultZoom = 18;
  const [map, setMap] = useState(null);
  const { user } = useUserAuth();
  const {
    address,
    loadingAddress,
    error: addressError
  } = useReverseGeocode(position);

  const { cities } = useCities();
  const [modalOpen, setModalOpen] = useState(false);
  const modalHasBeenOpened = useRef(false);

  const { toggles } = useCategoryStore();

  useEffect(() => {
    if (
      !loading &&
      ['browser_denied', 'ip_error_default', 'timeout_default'].includes(
        geolocationStatus
      ) &&
      !modalHasBeenOpened.current
    ) {
      setModalOpen(true);
      modalHasBeenOpened.current = true;
    }
  }, [loading, geolocationStatus]);

  const handleCitySelect = cityName => {
    const city = cities.find(c => c.name === cityName);
    if (city && map) {
      map.setView([city.lat, city.lng], defaultZoom);
      setModalOpen(false);
    }
  };

  const errorMessage = getGeolocationErrorMessage(geolocationStatus, error);

  return (
    <div className='relative w-full h-screen'>
      <MapContainer
        center={center}
        zoom={defaultZoom}
        className='w-full h-full'
        zoomControl={false}
        whenReady={event => {
          setMap(event.target);
        }}
        minZoom={4}
      >
        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          attribution='© OpenStreetMap contributors © CARTO'
          maxZoom={20}
        />

        <ZoomControl position='bottomright' />
        <Recenter center={center} zoom={defaultZoom} />

        {!error && position && (
          <>
            <Marker position={position} icon={wazeIcon}>
              <Popup>Tú estás aquí</Popup>
            </Marker>
            <Circle
              center={position}
              radius={80}
              pathOptions={{
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.2,
                stroke: false
              }}
            />
          </>
        )}

{reports.map((report, id) => {
          const catKey = categoryMapping[report.categoriaId];
          if (!toggles[catKey]) return null;
          if (!report.latitud || !report.longitud) return null;
          return <ReportMarker key={id} report={report} />;
        })}

      </MapContainer>

      <MyLocationButton
        map={map}
        position={position}
        defaultZoom={defaultZoom}
        className='absolute bottom-10 lg:bottom-32 right-7 z-[9999]'
      />

      {position && (address || loadingAddress || addressError) && (
        <div className='hidden md:block overflow-hidden absolute bottom-5 left-20 z-[9999]'>
          <AddressCard
            address={address}
            loadingAddress={loadingAddress}
            addressError={addressError}
          />
        </div>
      )}

      <div className='absolute top-5 right-5 z-[9999] flex items-center gap-4'>
        {/* ✅ Botón flotante de instalación de la PWA */}
        <InstallPWAButton />
        {user ? <UserMenu /> : <UserLogin />}
      </div>

      {/* Modal de selección de ciudad */}
      {modalOpen && (
        <CitySelectionDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          cities={cities}
          map={map}
          onCitySelect={handleCitySelect}
          message=''
          errorMessage={errorMessage}
          errorImage={sadFrog}
        />
      )}

      <CityNavigation map={map} />
    </div>
  );
}

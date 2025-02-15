import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from 'prop-types';
import L from "leaflet";

// Importar los íconos manualmente
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Crear un nuevo icono para los marcadores
const customMarker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Tamaño del icono
  iconAnchor: [12, 41], // Punto de anclaje
  popupAnchor: [1, -34], // Posición del popup
});

const MapView = ({ reports }) => {
  const defaultPosition = [-34.6037, -58.3816]; // Ubicación por defecto (Ej: Buenos Aires)

  return (
    <MapContainer center={defaultPosition} zoom={13} className="h-96 w-full rounded-lg">
      {/* Capa base de OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marcadores dinámicos con el icono corregido */}
      {reports.map((report, index) => (
        <Marker key={index} position={[report.lat, report.lng]} icon={customMarker}>
          <Popup>
            <strong>{report.title}</strong> <br />
            {report.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

MapView.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MapView;

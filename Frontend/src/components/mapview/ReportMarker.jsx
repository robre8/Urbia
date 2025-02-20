// ReportMarker.jsx
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';

// Importar íconos de Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Crear un nuevo icono para los marcadores
const customMarker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],   // Tamaño del icono
  iconAnchor: [12, 41], // Punto de anclaje
  popupAnchor: [1, -34] // Posición del popup
});

const ReportMarker = ({ report }) => {
  return (
    <Marker position={[report.lat, report.lng]} icon={customMarker}>
      <Popup>
        <strong>{report.title}</strong>
        <br />
        {report.description}
      </Popup>
    </Marker>
  );
};

ReportMarker.propTypes = {
  report: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};

export default ReportMarker;

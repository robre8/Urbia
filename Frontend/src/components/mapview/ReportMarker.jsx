import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';

// Importar íconos personalizados según la categoría
import infraIcon from '@/assets/svgs/FrogPinInfra.svg';
import seguridadIcon from '@/assets/svgs/FrogPinPoli.svg';
import saludIcon from '@/assets/svgs/FrogPinSalud.svg';
import eventosIcon from '@/assets/svgs/FrogPinSocial.svg';

// Mapeo de categorías a íconos
const categoryIcons = {
  Infraestructura: infraIcon,
  Seguridad: seguridadIcon,
  Salud: saludIcon,
  "Eventos Sociales": eventosIcon
};

const ReportMarker = ({ report }) => {
  const customMarker = new L.Icon({
    iconUrl: categoryIcons[report.category] || infraIcon, // Default a infraestructura si no hay categoría
    iconSize: [50, 50],   // Ajuste del tamaño para mejor visibilidad
    iconAnchor: [20, 50], // Anclaje del icono
    popupAnchor: [0, -40] // Posición del popup
  });

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
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired // Agregamos la validación de categoría
  }).isRequired
};

export default ReportMarker;

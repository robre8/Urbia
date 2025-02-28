// ReportMarker.jsx
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';

// Íconos para cada categoría (mapeados por ID)
import infraIcon from '@/assets/svgs/FrogPinInfra.svg';
import seguridadIcon from '@/assets/svgs/FrogPinPoli.svg';
import saludIcon from '@/assets/svgs/FrogPinSalud.svg';
import eventosIcon from '@/assets/svgs/FrogPinSocial.svg';

const categoryIcons = {
  1: infraIcon,
  2: seguridadIcon,
  3: saludIcon,
  4: eventosIcon
};

export default function ReportMarker({ report }) {
  const iconUrl = categoryIcons[report.categoryId] || infraIcon;

  const customMarker = new L.Icon({
    iconUrl,
    iconSize: [50, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -40]
  });

  return (
    <Marker position={[report.latitud, report.longitud]} icon={customMarker}>
      <Popup>
        <strong>{report.title}</strong>
        <br />
        {report.descripcion}
      </Popup>
    </Marker>
  );
}

ReportMarker.propTypes = {
  report: PropTypes.shape({
    // Usar los nombres reales que te da la API
    latitud: PropTypes.number.isRequired,
    longitud: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired
  }).isRequired
};

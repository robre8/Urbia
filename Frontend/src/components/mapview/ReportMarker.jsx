import { Marker } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";

import infraIcon from "@/assets/svgs/FrogPinInfra.svg";
import seguridadIcon from "@/assets/svgs/FrogPinPoli.svg";
import saludIcon from "@/assets/svgs/FrogPinSalud.svg";
import eventosIcon from "@/assets/svgs/FrogPinSocial.svg";

const categoryIcons = {
  1: infraIcon,
  2: seguridadIcon,
  3: saludIcon,
  4: eventosIcon,
};

export default function ReportMarker({ report, onClick, size = [50, 50] }) {
  const iconUrl = categoryIcons[report.categoriaId] || infraIcon;
  const [width, height] = size;
  const customMarker = L.icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [width * 0.4, height],
    popupAnchor: [0, -height * 0.8],
  });

  return <Marker position={[report.latitud, report.longitud]} icon={customMarker} eventHandlers={{ click: onClick }} />;
}

ReportMarker.propTypes = {
  report: PropTypes.shape({
    latitud: PropTypes.number.isRequired,
    longitud: PropTypes.number.isRequired,
    categoriaId: PropTypes.number.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.arrayOf(PropTypes.number),
};

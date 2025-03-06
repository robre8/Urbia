// ReportMarker.jsx
import { Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
import { useState } from "react";

import infraIcon from "@/assets/svgs/FrogPinInfra.svg";
import seguridadIcon from "@/assets/svgs/FrogPinPoli.svg";
import saludIcon from "@/assets/svgs/FrogPinSalud.svg";
import eventosIcon from "@/assets/svgs/FrogPinSocial.svg";
import clusterIcon from "@/assets/svgs/FrogPinGrupo.svg";

const categoryIcons = {
  1: infraIcon,
  2: seguridadIcon,
  3: saludIcon,
  4: eventosIcon,
};

const categoryMapping = {
  1: "Infraestructura",
  2: "Seguridad",
  3: "Salud",
  4: "Eventos Sociales",
};

export default function ReportMarker({
  reports = [],
  size = [50, 50],
  onReportSelect
}) {
  const [showPopup, setShowPopup] = useState(false);
  if (!Array.isArray(reports) || reports.length === 0) return null;

  const isCluster = reports.length > 1;

  // Si es clúster => usamos un size mayor, si no => usamos el size por defecto
  const [width, height] = isCluster ? [60, 60] : size;

  const iconUrl = isCluster
    ? clusterIcon
    : categoryIcons[reports[0]?.categoriaId] || infraIcon;

  const iconHtml = isCluster
    ? `<div style="position: relative; width: ${width}px; height: ${height}px; overflow: hidden;">
         <img src="${iconUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
         <span style="
           position: absolute;
           top: 0;
           right: 0;
           background: red;
           color: white;
           border-radius: 50%;
           padding: 2px 6px;
           font-size: 12px;
         ">
           ${reports.length}
         </span>
       </div>`
    : `<div style="width: ${width}px; height: ${height}px; overflow: hidden;">
         <img src="${iconUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
       </div>`;

  const customMarker = L.divIcon({
    html: iconHtml,
    iconSize: [width, height],
    iconAnchor: [width * 0.4, height],
    popupAnchor: [0, -height * 0.8],
    className: "",
  });

  // Evento de clic: si es clúster, abrimos popup; si es uno solo, abrimos detalle
  const eventHandlers = isCluster
    ? { click: () => setShowPopup(true) }
    : {
        click: () => {
          if (onReportSelect) onReportSelect(reports[0]);
        },
      };

  return (
    <Marker
      position={[reports[0].latitud, reports[0].longitud]}
      icon={customMarker}
      eventHandlers={eventHandlers}
    >
      {isCluster && showPopup && (
        <Popup onClose={() => setShowPopup(false)}>
          <div>
            <h3 className="text-base font-semibold mb-2">
              Reportes en esta ubicación
            </h3>
            
            <ul className="list-none p-0 m-0 max-h-52 overflow-y-auto">
              {reports.map((r) => (
                <li
                  key={r.id}
                  className="mb-2 flex items-center cursor-pointer"
                  onClick={() => {
                    if (onReportSelect) onReportSelect(r);
                    setShowPopup(false);
                  }}
                >
                  {r.urlImagen && (
                    <img
                      src={r.urlImagen}
                      alt="Imagen del reporte"
                      className="w-12 h-12 object-cover mr-2 rounded-full"
                    />
                  )}
                  <div>

                  <h1 className="text-sm font-semibold">{r.titulo}</h1>
                  <small className="text-[10px]">{categoryMapping[r.categoriaId]}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Popup>
      )}
    </Marker>
  );
}

ReportMarker.propTypes = {
  reports: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      urlImagen: PropTypes.string,
      latitud: PropTypes.number.isRequired,
      longitud: PropTypes.number.isRequired,
      categoriaId: PropTypes.number.isRequired,
      titulo: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
    })
  ),
  size: PropTypes.arrayOf(PropTypes.number),
  onReportSelect: PropTypes.func,
};

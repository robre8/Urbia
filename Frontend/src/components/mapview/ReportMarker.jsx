// ReportMarker.jsx
import { Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
import { useState, useMemo } from "react";
import useCategoryStore from "@/lib/store/useCategoryStore";

import infraIcon from "@/assets/svgs/FrogPinInfra.svg";
import seguridadIcon from "@/assets/svgs/FrogPinPoli.svg";
import saludIcon from "@/assets/svgs/FrogPinSalud.svg";
import eventosIcon from "@/assets/svgs/FrogPinSocial.svg";
import clusterIcon from "@/assets/svgs/FrogPinGrupo.svg";

// Updated icon mapping to match backend category IDs
const categoryIcons = {
  1: saludIcon,         // ID 1 = Salud
  2: infraIcon,         // ID 2 = Infraestructura
  3: seguridadIcon,     // ID 3 = Seguridad
  4: eventosIcon,       // ID 4 = Eventos Sociales
};

// Category ID to toggle key mapping
const categoryToToggleKey = {
  1: "salud",
  2: "infraestructura",
  3: "seguridad",
  4: "eventosSociales",
};

// Updated category mapping to match backend category IDs
const categoryMapping = {
  1: "Salud",               // ID 1 = Salud
  2: "Infraestructura",     // ID 2 = Infraestructura
  3: "Seguridad",           // ID 3 = Seguridad
  4: "Eventos Sociales",    // ID 4 = Eventos Sociales
};

export default function ReportMarker({
  reports = [],
  size = [50, 50],
  onReportSelect
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { toggles } = useCategoryStore();
  
  // Filter reports based on active category toggles
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const toggleKey = categoryToToggleKey[report.categoriaId];
      return toggleKey && toggles[toggleKey];
    });
  }, [reports, toggles]);
  
  // If no reports are visible after filtering, don't render anything
  if (!Array.isArray(filteredReports) || filteredReports.length === 0) return null;

  const isCluster = filteredReports.length > 1;

  // Si es clúster => usamos un size mayor, si no => usamos el size por defecto
  const [width, height] = isCluster ? [60, 60] : size;

  // If it's not a cluster, use the specific category icon
  // If it is a cluster, use the cluster icon
  const iconUrl = isCluster
    ? clusterIcon
    : categoryIcons[filteredReports[0]?.categoriaId] || infraIcon;

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
           ${filteredReports.length}
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
          if (onReportSelect) onReportSelect(filteredReports[0]);
        },
      };

  return (
    <Marker
      position={[filteredReports[0].latitud, filteredReports[0].longitud]}
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
              {filteredReports.map((r) => (
                <li
                  key={r.id}
                  className="mb-2 flex items-center cursor-pointer"
                  onClick={() => {
                    if (onReportSelect) onReportSelect(r);
                    setShowPopup(false);
                  }}
                >
                  {r.urlImagen ? (
                    <img
                      src={r.urlImagen}
                      alt="Imagen del reporte"
                      className="w-12 h-12 object-cover mr-2 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 mr-2 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={categoryIcons[r.categoriaId] || infraIcon} 
                        alt="Icono de categoría"
                        className="w-10 h-10 object-contain" 
                      />
                    </div>
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

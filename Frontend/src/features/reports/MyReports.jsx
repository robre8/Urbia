import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import historialIcon from "../../assets/history-line.svg";
import iconMap from "../../assets/map-pin-2-line.svg";
import deleteAlert from "@/components/alerts/deleteAlerts/DeleteAlert";
import styles from "./styles/MyReports.module.css";
import { useState } from "react"; // Add this import

import frogReportInfra from "../../assets/svgs/FrogReportInfra.svg";
import frogReportPoli from "../../assets/svgs/FrogReportPoli.svg";
import frogReportSalud from "../../assets/svgs/FrogReportSalud.svg";
import frogReportSocial from "../../assets/svgs/FrogReportSocial.svg";

import ReportActions from "./ReportActions";

function getCategoryIcon(categoryId) {
  switch (categoryId) {
    case 1:
      return frogReportInfra;
    case 2:
      return frogReportPoli;
    case 3:
      return frogReportSalud;
    case 4:
      return frogReportSocial;
    default:
      return iconMap;
  }
}

// Helper function to truncate text
const truncateText = (text, maxLength = 25) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

function MyReports({ closeDrawer, reports, deleteReport, loading, error, onSelectReport }) {
  const [hoveredReportId, setHoveredReportId] = useState(null);
  
  const handleDelete = (id) => {
    closeDrawer();
    deleteAlert(id, (deletedId) => {
      deleteReport(deletedId);
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<Accordion
  type="single"
  collapsible
  defaultValue={reports && reports.length > 0 ? "item-1" : undefined}
>
  <AccordionItem value="item-1">
    <AccordionTrigger className="text-[16px] pb-3">
      <div className="flex items-center gap-2">
        <img src={historialIcon} alt="icono del historial" />
        Mis reportes
      </div>
    </AccordionTrigger>
    <AccordionContent>
      {reports && reports.length > 0 ? (
        <div className={styles.scrollContainer}>
          {reports.map((report) => (
            <div 
              key={report.id} 
              className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-100"
            >
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer" 
                onClick={() => onSelectReport(report)}
              >
                <img src={getCategoryIcon(report.categoriaId)} alt="" className="w-8 h-8" />
                <div 
                  className="relative"
                  onMouseEnter={() => setHoveredReportId(report.id)}
                  onMouseLeave={() => setHoveredReportId(null)}
                >
                  <p className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {truncateText(report.titulo)}
                  </p>
                  {hoveredReportId === report.id && (
                    <div className="absolute left-0 bottom-full mb-2 bg-black text-white px-3 py-1.5 rounded text-sm z-50 whitespace-normal max-w-[250px]">
                      {report.titulo}
                    </div>
                  )}
                </div>
              </div>
              <ReportActions 
                onEdit={() => console.log(`Editar reporte ${report.id}`)} 
                onDelete={() => handleDelete(report.id)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Aún no has creado ningún reporte</p>
      )}
    </AccordionContent>
  </AccordionItem>
</Accordion>
  );
}

export default MyReports;


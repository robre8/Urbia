import historialIcon from "../../assets/history-line.svg";
import iconMap from "../../assets/map-pin-2-line.svg";
import deleteAlert from "@/components/alerts/deleteAlerts/DeleteAlert";
import styles from "./styles/MyReports.module.css";
import { useState } from "react";
import { toast } from "sonner";
import frogError from "@/assets/frogError.png";
import { useUserLocation } from "@/components/mapview/hooks/useUserLocation";
import useReportsStore from "@/lib/store/useReportsStore"; // Add this import

import frogReportInfra from "../../assets/svgs/FrogReportInfra.svg";
import frogReportPoli from "../../assets/svgs/FrogReportPoli.svg";
import frogReportSalud from "../../assets/svgs/FrogReportSalud.svg";
import frogReportSocial from "../../assets/svgs/FrogReportSocial.svg";

import ReportActions from "./ReportActions";

function getCategoryIcon(categoryId) {
  switch (categoryId) {
    case 1:
      return frogReportSalud;
      case 2:
      return frogReportInfra;
      case 3:
      return frogReportPoli;
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
  const { position, accuracy } = useUserLocation();
  
  const hasAccurateLocation = () => {
    return position && accuracy && accuracy < 50;
  };
  
  const handleCreateReport = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasAccurateLocation()) {
      const formTrigger = document.getElementById("open-report-form");
      if (formTrigger) {
        formTrigger.click();
      }
      closeDrawer();
    } else {
      toast(
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <div className="flex-shrink-0 w-32 flex justify-center">
            <img src={frogError} alt="Frog" className="h-28 w-auto object-contain" />
          </div>
          <div className="text-center sm:text-left">
            Para crear un reporte, primero<strong> haz click</strong> en algún punto del mapa y confirma la ubicación.
          </div>
        </div>,
        {
          duration: 5000,
          position: "bottom-center",
          className: "p-4 bg-white rounded-xl shadow-lg mx-auto",
          style: { 
            width: "min(90vw, 600px)",
            maxWidth: "600px",
            left: "50%",
            transform: "translateX(-50%)",
            margin: "0 auto"
          },
        }
      );
      closeDrawer();
    }
  };
  
  const handleDelete = (id) => {
    closeDrawer();
    deleteAlert(id, (deletedId) => {
      deleteReport(deletedId);
    });
  };

  const handleEdit = (report) => {
    // Close the drawer
    closeDrawer();
    
    // Set the report in the store for editing with all necessary flags
    useReportsStore.setState({ 
      reportPreview: report,
      isEditMode: true,
      editSource: 'myReports', // Add this line to indicate edit is from MyReports
      // Store original coordinates to ensure they don't change
      originalCoordinates: {
        latitud: report.latitud,
        longitud: report.longitud
      }
    });
    
    // Open the report form
    const formTrigger = document.getElementById("open-report-form");
    if (formTrigger) {
      formTrigger.click();
    }
    
    // Set isConfirm to true to show "Guardar cambios" button
    setTimeout(() => {
      const event = new CustomEvent('set-edit-mode', { detail: true });
      document.dispatchEvent(event);
    }, 300);
  };
  
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-[16px] font-medium pb-3">
        <img src={historialIcon} alt="icono del historial" />
        Mis reportes
      </div>
      
      {reports && reports.length > 0 ? (
        <div className={`${styles.scrollContainer} pt-5`}>
          {/* Sort reports by category ID and then by title alphabetically */}
          {[...reports]
            .sort((a, b) => {
              // First sort by category
              if (a.categoriaId !== b.categoriaId) {
                return a.categoriaId - b.categoriaId;
              }
              // Then sort alphabetically by title
              return a.titulo.localeCompare(b.titulo);
            })
            .map((report) => (
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
                    <div className="absolute bottom-0 left-0 right-0 mx-auto bg-black text-white px-3 py-1.5 rounded text-sm whitespace-normal z-[9999]" 
                      style={{
                        width: 'calc(100% - 16px)',
                        transform: 'translateY(100%)',
                        marginBottom: '8px'
                      }}>
                      {report.titulo}
                    </div>
                  )}
                </div>
              </div>
              <ReportActions 
                onEdit={() => handleEdit(report)}
                onDelete={() => handleDelete(report.id)} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 px-2">
          <p className="mb-3">Aún no has creado ningún reporte</p>
          <button 
            onClick={handleCreateReport} 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Crear mi primer reporte
          </button>
        </div>
      )}
    </div>
  );
}

export default MyReports;


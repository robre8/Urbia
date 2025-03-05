// MyReports.jsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import historialIcon from "../../assets/history-line.svg";
import iconMap from "../../assets/map-pin-2-line.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import deleteAlert from "@/components/alerts/deleteAlerts/DeleteAlert";
import styles from "./styles/MyReports.module.css";

import frogReportInfra from "../../assets/svgs/FrogReportInfra.svg";
import frogReportPoli from "../../assets/svgs/FrogReportPoli.svg";
import frogReportSalud from "../../assets/svgs/FrogReportSalud.svg";
import frogReportSocial from "../../assets/svgs/FrogReportSocial.svg";

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

function MyReports({ closeDrawer, reports, deleteReport, loading, error }) {
  const handleDelete = (id) => {
    closeDrawer();
    deleteAlert(id, (deletedId) => {
      deleteReport(deletedId);
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Accordion type="single" collapsible className="">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-[16px]">
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
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getCategoryIcon(report.categoriaId)}
                      alt=""
                      className="w-8 h-8"
                    />
                    <p>{report.titulo}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-3">
                      <Ellipsis color="#222222" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white rounded-lg shadow-xl border border-slate-300">
                      <DropdownMenuItem>
                        <Button
                          variant="link"
                          className="w-full flex items-center justify-evenly px-4 py-2 hover:bg-gray-100"
                        >
                          <Pencil className="size-4" />
                          Editar
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          variant="link"
                          onClick={() => handleDelete(report.id)}
                          className="flex items-center gap-1 px-4 py-2 text-[#F53434] hover:text-white hover:bg-[#F53434]"
                        >
                          <Trash2 className="size-4" />
                          Eliminar
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">Aun no has creado ningún reporte</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default MyReports;

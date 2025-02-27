import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import historialIcon from "../../assets/history-line.svg"
import iconMap from "../../assets/map-pin-2-line.svg" // provisorio
import useReportsStore from "@/lib/store/useReportsStore"
import styles from "./styles/MyReports.module.css"
import { useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Ellipsis, Pencil, Trash2 } from "lucide-react"
import deleteAlert from "@/components/alerts/deleteAlerts/DeleteAlert"


function MyReports({ closeDrawer }) {
  const {reports, deleteReport, fetchReports} = useReportsStore();

  const handleDelete = (id) => {
    closeDrawer();
  
    deleteAlert(id, (deletedId) => {
      console.log("Confirmación de eliminación recibida para ID:", deletedId);
      deleteReport(deletedId); 
    });
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <Accordion type="single" collapsible className="w-full py-4">
    <AccordionItem value="item-1">
      <AccordionTrigger className="text-[16px]">
        <div className="flex items-center gap-2">
        <img src={historialIcon} alt="icono del historial" />
        Mis reportes
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {reports.length > 0 ? (
        <div className={styles.scrollContainer}>
          {reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <img src={iconMap} alt="" />
                <p>{report.title}</p>
              </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3">
              <Ellipsis color="#222222" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white rounded-lg shadow-xl border border-slate-300">
                <DropdownMenuItem>
                  <Button variant="link" className="w-full flex items-center justify-evenly px-4 py-2 hover:bg-gray-100">
                  <Pencil className="size-4" />
                  Editar
                  </Button> 
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant="link" onClick={() => handleDelete(report.id)} className="flex items-center gap-1 px-4 py-2 text-[#F53434] hover:text-white hover:bg-[#F53434]">
                  <Trash2 className="size-4" />
                    Eliminar
                  </Button> 
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          ))}
        </div>   
        ):(
        <p className="text-center">Aun no has creado ningún reporte</p>
        )}

      </AccordionContent>
    </AccordionItem>
  </Accordion>
  )
}

export default MyReports

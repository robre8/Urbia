import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import historialIcon from "../../assets/history-line.svg"
import iconMap from "../../assets/map-pin-2-line.svg" // provisorio
import dotsIcons from "../../assets/more-line.svg"
import useReportsStore from "@/lib/store/useReportsStore"
import { useEffect } from "react";

function MyReports() {
  const {reports, fetchReports} = useReportsStore();

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
          reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <img src={iconMap} alt="" />
                <p>{report.title}</p>
              </div>
            
              <button>
                <img src={dotsIcons} alt="" />
              </button>
            </div>
          ))
        ):(
        <p>Aun no has creado ningún reporte</p>
        )}

      </AccordionContent>
    </AccordionItem>
  </Accordion>
  )
}

export default MyReports
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import historialIcon from "../../assets/history-line.svg"

function MyReports() {
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
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
  )
}

export default MyReports
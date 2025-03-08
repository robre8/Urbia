import { MapPinPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import frogError from "@/assets/frogError.png";

const ButtonAddNewReport = ({ onClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show toast with instructions
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
    
    // Call additional onClick handler if provided
    if (onClick) onClick(e);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            onClick={handleClick}
            className="flex items-center justify-center w-12 h-12 bottom-24 fixed right-7 lg:right-7 lg:bottom-48 rounded-full border border-gray-300 shadow-md bg-white hover:bg-gray-100 text-gray-800 transition z-[9999]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <MapPinPlus size={22} />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Nuevo Reporte</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ButtonAddNewReport;

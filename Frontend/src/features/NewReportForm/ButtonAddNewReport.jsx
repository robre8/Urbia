import { MapPinPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ButtonAddNewReport = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className="flex items-center justify-center  w-12 h-12 bottom-24 fixed right-7 lg:right-7 lg:bottom-48 rounded-full border border-gray-300 shadow-md bg-white hover:bg-gray-100 text-gray-800 transition z-[9999]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <MapPinPlus size={22} />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Nuevo Reporte</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ButtonAddNewReport;

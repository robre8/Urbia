import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PropTypes from "prop-types";
import { Crosshair } from "lucide-react";

export default function MyLocationButton({
  map,
  position,
  defaultZoom = 13,
  className = ""
}) {
  const handleClick = () => {
    if (map && position) {
      map.flyTo(position, defaultZoom, { duration: 1.2 });
    } else {
      alert("No se ha obtenido la ubicación o el mapa todavía.");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            className={`flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 shadow-md bg-white ${className}`}
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Crosshair size={22} />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Mostrar tu ubicación</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

MyLocationButton.propTypes = {
  map: PropTypes.object,
  position: PropTypes.array,
  defaultZoom: PropTypes.number,
  className: PropTypes.string
};

import { LuMapPinPlusInside } from "react-icons/lu";
import styles from './ButtonAddNewReport.module.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ButtonAddNewReport = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={styles.button}>
            <LuMapPinPlusInside className="w-6 h-6" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Nuevo Reporte</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ButtonAddNewReport;

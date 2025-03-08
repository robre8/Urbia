
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { useCallback } from 'react';
import { SquarePen } from "lucide-react";

export function ReportLocationToast({ onCreateReport, onCancel }) {
  const handleCreateReport = useCallback(() => {
    toast.dismiss();
    setTimeout(() => {
      onCreateReport();
    }, 100);
  }, [onCreateReport]);

  const handleCancel = useCallback(() => {
    toast.dismiss();
    setTimeout(() => {
      onCancel();
    }, 100);
  }, [onCancel]);
  
  return (
    <div className="flex flex-col md:flex-row w-full items-center">
      <div className="w-full md:w-2/3 p-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <SquarePen className="h-5 w-5" />
          <h3 className="text-lg font-medium">Crear reporte</h3>
        </div>
        
        <p className="text-sm text-center">
          Estás a punto de crear un nuevo reporte en esta ubicación. ¿Deseas continuar?
        </p>
      </div>
      
      <div className="w-full md:w-1/3 p-4 flex flex-col gap-2">
        <Button 
          onClick={handleCreateReport}
          className="w-full bg-[#9bee5e] hover:bg-[#8bda54] text-black font-medium rounded-xl"
        >
          Crear reporte
        </Button>
        <Button 
          onClick={handleCancel}
          variant="outline" 
          className="w-full bg-[#222222] text-white hover:bg-[#333333] font-medium rounded-xl"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
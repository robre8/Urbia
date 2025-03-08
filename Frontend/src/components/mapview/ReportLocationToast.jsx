
import { Button } from '@/components/ui/button';

export function ReportLocationToast({ onCreateReport, onCancel }) {
  return (
    <div className="p-5 w-full">
      <div className="text-center mb-4">
        Estás a punto de crear un nuevo reporte en esta ubicación. ¿Deseas continuar?
      </div>
      <div className="flex flex-col gap-2">
        <Button 
          onClick={onCreateReport}
          className="w-full bg-[#9bee5e] hover:bg-[#8bda54] text-black font-medium"
        >
          Crear reporte
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline" 
          className="w-full bg-[#222222] text-white hover:bg-[#333333] font-medium"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
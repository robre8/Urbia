import { Button } from '@/components/ui/button';
import { LuSparkles } from 'react-icons/lu';

export function FormButtons({ isValid, isConfirm, loading, onSubmit, onCancel }) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="submit"
        disabled={!isValid || loading}
        onClick={onSubmit}
        className={`w-full rounded-[10px] gap-2 ${
          isValid && !loading
            ? 'bg-lime-300 text-black hover:bg-lime-400'
            : 'bg-gray-300 text-gray-800'
        }`}
      >
        {!isConfirm ? (
          <>
            <LuSparkles className="h-5" />
            <span>Generar reporte</span>
          </>
        ) : (
          <span>Guardar cambios</span>
        )}
      </Button>

      <Button
        type="button"
        disabled={loading}
        className="w-full rounded-[10px] hover:bg-gray-500"
        onClick={onCancel}
      >
        Cancelar
      </Button>
    </div>
  );
}
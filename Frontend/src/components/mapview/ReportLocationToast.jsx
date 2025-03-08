
export function ReportLocationToast({ onCreateReport, onCancel }) {
  return (
    <div className="flex flex-col w-full p-4">
      <p className="text-sm mb-4">
        Estás a punto de crear un nuevo reporte en esta ubicación. ¿Deseas continuar?
      </p>
      <div className="flex gap-2">
        <button 
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Cancelar
        </button>
        <button 
          onClick={onCreateReport}
          className="flex-1 bg-black text-white font-medium py-2 px-4 rounded"
        >
          Crear reporte
        </button>
      </div>
    </div>
  );
}
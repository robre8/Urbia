import { useState, useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
//import postReport from '@/lib/api/reports/postReport';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { LuMapPin   } from 'react-icons/lu';

const categoryDefault = {id:99, nombre:'default'}


const ConfirmReport = ({open, setOpen, setOpenParent}) => {
  const { categories  } = useCategoryStore();
  const { reportPreview, clearStorage } = useReportsStore();   
  //const [open, setOpen] = useState(false);     
  const [currentCategory, setCurrentCategory] = useState({});
  const handleConfirm = (e) => {
    e.preventDefault();
    setOpen(false);
    setOpenParent(false);
    clearStorage();
    
  }
  const handleGoBack = () => {
    setOpen(false);
  }

  useEffect(() => {
    setCurrentCategory(
      categories.find(
        cat => cat.id === parseInt(reportPreview?.categoriaId)
      ) || categoryDefault
    );
  }, [categories, reportPreview]);
  

  //console.log(reportPreview.categoriaId, categories, currentCategory);
  return (
    <Sheet open={open} onOpenChange={setOpen}>                     
      <SheetContent className="overflow-y-auto px-4 flex flex-col gap-2">
        
          <SheetHeader className="space-y-2">
            <SheetTitle className="text-2xl font-bold text-gray-900 p-4">
              Reportar incidente
            </SheetTitle>
            <SheetDescription>
              {/* Por favor, completa los siguientes campos para reportar un
              incidente. */}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-8 py-4">
            {/* Imagen */}
            <div className=" grid gap-3">
              <Label htmlFor="imagen" className="font-semibold">
                Imagen
              </Label>
              <img src={reportPreview.urlImagen}
                className='w-full h-32 bg-slate-200 object-cover'
                alt="Vista previa de la Imagen del reporte" 
              />              
            </div>

            {/* Categoría */}
            <div className="grid gap-3">
              <Label  className="font-semibold">
                Categoría 
              </Label>              
              <Label  className="font-semibold">
                {currentCategory.nombre}
              </Label>
            </div>

            {/* Título */}
            <div className="grid gap-3">
              <Label  className="font-semibold">
                Título 
              </Label>
              <Label  className="font-semibold">
                {reportPreview.titulo} 
              </Label>
              
             
            </div>

            {/* Descripción */}
            <div className="grid gap-3">
              <Label  className="font-semibold">
                Descripción
              </Label>
              <Label  className="font-semibold">
                {reportPreview.descripcion}
              </Label>              
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <Button  
              onClick={handleConfirm}
              className={'w-full rounded-[10px] gap-2 bg-lime-300 text-black hover:bg-lime-400 '}
            >
              Reportar
            </Button>
            <Button  
              type="button"
              className="hover:bg-gray-500 w-full rounded-[10px]"
              onClick={handleGoBack}
            >
              Volver
            </Button>
          </div>
        
      </SheetContent>        
      
    </Sheet>
  );
};

export default ConfirmReport;

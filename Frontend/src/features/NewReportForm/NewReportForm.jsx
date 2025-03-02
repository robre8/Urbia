import { useState, useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
import postReport from '@/lib/api/reports/postReport';

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
import ButtonAddNewReport from './ButtonAddNewReport';
import { LuMic, LuCamera, LuSparkles, LuImagePlus  } from 'react-icons/lu';

const NewReportForm = () => {
  const { categories, fetchCategories, loading, error } = useCategoryStore();
  const { reports, fetchReports, loadingReport, errorReport } = useReportsStore();

  // Estado con el formato solicitado
  const [formData, setFormData] = useState({
    audio: '', // "voice audio msg"
    imagen: '', // "photo"
    reporte: {            
      titulo: '',
      descripcion: '',
      latitud: 0.1,
      longitud: 0.1,
      categoriaId: '',
      usuarioId: 1
    }
  });
// "titulo": "choque entre dos autos",
// 	"descripcion": "chocaron dos autos en el centro",
// 	"latitud": -12.3456,
// 	"longitud": 45.6789,
// 	"categoriaId": 4,
// 	"usuarioId": 1

  const [errors, setErrors] = useState({
    categoriaId: false,
    titulo: false,
    descripcion: false
  });

  const [charCount, setCharCount] = useState({
    titulo: 0,
    descripcion: 0
  });

  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); 

  const validateForm = () => {
    const newErrors = {
      categoriaId: !formData.reporte.categoriaId,
      titulo:
        !formData.reporte.titulo || formData.reporte.titulo.length > 50,
      descripcion:
        !formData.reporte.descripcion ||
        formData.reporte.descripcion.length > 200
    };
    setErrors(newErrors);
    const isValid = !Object.values(newErrors).some((error) => error);
    setIsFormValid(isValid);
    return isValid;
  };

  // Se ejecuta la validación cada vez que cambian los campos requeridos
  useEffect(() => {
    validateForm();
  }, [
    formData.reporte.titulo,
    formData.reporte.descripcion,
    formData.reporte.categoriaId
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      // Construimos FormData
      const formDataToSend = new FormData();
  
      // Append de los archivos (audio e imagen)
      // Asegúrate de que formData.audio y formData.imagen sean los File Objects
      formDataToSend.append("audio", formData.audio);
      formDataToSend.append("imagen", formData.imagen);
  
      // Para los campos que son un objeto (reporte),
      // se suele mandar como JSON dentro de un campo de texto:
       // Se añade el reporte como un Blob JSON
       formDataToSend.append('reporte', new Blob([JSON.stringify(formData.reporte)], { type: 'application/json' }));
      //formDataToSend.append("reporte", JSON.stringify(formData.reporte));
  
      // Enviamos el FormData      
      const response = await postReport(formDataToSend);
      console.log("respuesta del back", response.message, response.data);
    }
  };
  

  const handleInputChange = (name, value) => {
    if (['titulo', 'descripcion', 'categoriaId'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        reporte: {
          ...prev.reporte,
          [name]: value
        }
      }));
      if (name === 'titulo' || name === 'descripcion') {
        setCharCount((prev) => ({ ...prev, [name]: value.length }));
      }
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: false }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    validateForm();
  };

  const handleClickBtnImg = (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, imagen: e.target.files[0] }));
    console.log('click on image load');
  };

  const handleClickBtnAudio = (e) => {
    setFormData((prev) => ({ ...prev, audio: e.target.files[0] }));
    console.log('click on Audio load');
  };

  // Función para cancelar y cerrar
  const handleCancel = () => {
    console.log('close sheet');
    setOpen(false);
    // Opcional: resetear el formulario si lo deseas.
  };

  useEffect(() => {
    //console.log('⏳ Ejecutando fetchCategories...');
    fetchCategories();
    //fetchReports(1);
  }, []);

  if (loadingReport && loading) {
    return (
      <div>Cargando...</div>      
    )
  }

  //console.log(reports);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      
      <SheetTrigger
        className="fixed bottom-48 lg:bottom-40 right-7"
        onClick={() => setOpen(true)}
      >
        <ButtonAddNewReport />
      </SheetTrigger>
      <SheetContent className="overflow-y-auto px-4 flex flex-col gap-2">
        <form onSubmit={handleSubmit}>
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
              <div className="flex flex-row gap-3">
                {/* Sacar foto */}
                <input
                  type="file"
                  id="imagen"
                  accept="image/*"
                  onChange={handleClickBtnImg}
                  className="hidden"
                />
                <label
                  htmlFor="imagen02"
                  className="bg-lime-300 rounded-[16px] hover:bg-lime-200 px-2 py-2 flex flex-col items-center justify-center w-[140px] h-[113px] gap-4  cursor-pointer"
                >
                  <LuCamera className="h-5 w-fit" />
                  <span>Tomar foto</span>
                </label>

                  {/* subir imagen */}
                <input
                  type="file"
                  id="imagen02"
                  accept="image/*"
                  onChange={handleClickBtnImg}
                  className="hidden"
                />
                <label
                  htmlFor="imagen02"
                  className="bg-lime-300 rounded-[16px] hover:bg-lime-200 px-2 py-2 flex flex-col items-center justify-center w-[140px] h-[113px] gap-4  cursor-pointer"
                >
                  <LuImagePlus  className="h-5 w-fit" />
                  <span>Subir foto</span>
                </label>
              </div>
            </div>

            {/* Categoría */}
            <div className="grid gap-3">
              <Label htmlFor="category" className="font-semibold">
                Categoría *
              </Label>
              <Select
                value={formData.reporte.categoriaId}
                onValueChange={(value) =>
                  handleInputChange('categoriaId', value)
                }
                className={errors.categoriaId ? 'border-red-500' : ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem disabled>
                      Cargando categorías...
                    </SelectItem>
                  ) : error ? (
                    <SelectItem disabled>
                      Error al cargar categorías
                    </SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  ) : (
                    categories.map((cat, index) => (
                      <SelectItem
                        key={cat.id ?? index}
                        value={cat.id?.toString() ?? index.toString()}
                      >
                        {cat.nombre || 'Categoría sin nombre'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.categoriaId && (
                <span className="text-red-500 text-sm">
                  Este campo es requerido
                </span>
              )}
            </div>

            {/* Título */}
            <div className="grid gap-3">
              <Label htmlFor="titulo" className="font-semibold">
                Título *
              </Label>
              <Input
                id="titulo"
                value={formData.reporte.titulo}
                maxLength="50"
                onChange={(e) =>
                  handleInputChange('titulo', e.target.value)
                }
                className={errors.titulo ? 'border-red-500' : ''}
                placeholder="Nombre del reporte"
              />
              <div className="flex justify-between">
                {errors.titulo && (
                  <span className="text-red-500 text-sm">
                    Máximo 50 caracteres
                  </span>
                )}
                <span
                  className={`text-sm ml-auto ${
                    charCount.titulo > 50
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {charCount.titulo}/50
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="grid gap-3">
              <Label htmlFor="descripcion" className="font-semibold">
                Descripción *
              </Label>
              <div className="relative">
                <Textarea
                  id="descripcion"
                  value={formData.reporte.descripcion}
                  maxLength="200"
                  onChange={(e) =>
                    handleInputChange('descripcion', e.target.value)
                  }
                  className={`resize-none h-64 pb-10 ${
                    errors.descripcion ? 'border-red-500' : ''
                  }`}
                  placeholder="Descripción del reporte"
                />
                <div className="flex justify-between mt-2">
                  {errors.descripcion && (
                    <span className="text-red-500 text-sm">
                      Máximo 200 caracteres
                    </span>
                  )}
                  <span
                    className={`text-sm ml-auto ${
                      charCount.descripcion > 200
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {charCount.descripcion}/200
                  </span>
                </div>
                <div className="absolute right-6 bottom-8">
                  <input
                    type="file"
                    id="audio"
                    accept="audio/*"
                    onChange={handleClickBtnAudio}
                    className="hidden"
                  />
                  <label
                    htmlFor="audio"
                    className="bg-lime-300 hover:bg-lime-200 rounded-[5px] p-2 cursor-pointer inline-block"
                  >
                    <LuMic className="h-5 w-5" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <Button
              type="submit"
              className={`w-full rounded-[10px] gap-2 ${
                isFormValid
                  ? 'bg-lime-300 text-black hover:bg-lime-400'
                  : 'bg-gray-300 text-gray-800'
              }`}
              disabled={!isFormValid}
            >
              <LuSparkles  className="h-5 w-fit"/>Generar reporte
            </Button>
            <Button
              type="button"
              className="hover:bg-gray-500 w-full rounded-[10px]"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default NewReportForm;

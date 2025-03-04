import { useState, useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
import ConfirmReport from './ConfirmReport';
import { useUserAuth } from '@/lib/store/useUserAuth';


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
import noImageSvg from  "../../assets/svgs/no-image-svgrepo-com.svg";
import deleteReport from '@/lib/api/reports/deleteReport';
import { useUserLocation } from '@/components/mapview/hooks/useUserLocation';

const NewReportForm = () => {
  const { categories, fetchCategories, loading, error } = useCategoryStore();
  const {loading : loadingReports, loading : loadingReport, errorReport, reportPreview, clearReportPreview, sendReport, editReport } = useReportsStore();
  const [previewImageFileName, setPreviewImageFileName] = useState(reportPreview.urlImagen || '');
  const [open, setOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false); 
  const [openConfirm, setOpenConfirm] = useState(false);  
  const [isConfirm, setIsConfirm] = useState(false);
  const {position, loading : loadingLocation} = useUserLocation();

  const {user, loading : loadingUser } = useUserAuth();

  
  // Estado con el formato solicitado
  const [formData, setFormData] = useState({
    audio:  '', 
    imagen: '', 
    reporte: {            
      id: parseInt(reportPreview.id) || '',
      titulo: reportPreview.titulo || '',
      descripcion: reportPreview.descripcionDespuesDeIa || '',
      latitud: reportPreview.latitud || 0.1,
      longitud: reportPreview.longitud || 0.1,
      categoriaId: reportPreview.categoriaId || '',
      usuarioId: reportPreview.usuarioId || 1
    }
  });


  const [errors, setErrors] = useState({
    categoriaId: false,
    titulo: false,
    descripcion: false
  });

  const [charCount, setCharCount] = useState({
    titulo: 0,
    descripcion: 0
  });

  const validateForm = () => {
    const newErrors = {
      categoriaId: !formData.reporte.categoriaId,
      titulo:
        !formData.reporte.titulo || formData.reporte.titulo.length > 50,
      descripcion:
        !formData.reporte.descripcion ||
        formData.reporte.descripcion.length > 400
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

  //console.log(reportPreview != undefined)
  const handleSubmit = async (e) => {
    e.preventDefault();  
    
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append(
        'reporte',
        new Blob([JSON.stringify(formData.reporte)], { type: 'application/json' })
      );
      
      if (!isConfirm) {
        formDataToSend.append("audio", formData.audio);
        formDataToSend.append("imagen", formData.imagen);
        console.log('Se envia a sendReport.', formData);
        await sendReport(formDataToSend);        
        handleOpenConfirm();
      }
     else {      
      console.log('Se envia a editReport.', formData.reporte);      
      await editReport(formData.reporte);
      clearReportPreview();   
      setIsConfirm(false);   
      setOpen(false);
    }
    }else{
      console.log("formulario no valido")
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
    const {name : fileName, size : fileSize } = e.target.files[0];
    console.log('click on image load', fileName, fileSize);    
    setPreviewImageFileName(URL.createObjectURL(e.target.files[0]));
    setFormData((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleClickBtnAudio = (e) => {
    setFormData((prev) => ({ ...prev, audio: e.target.files[0] }));
    console.log('click on Audio load');
  };

  // Función para cancelar y/o eliminar
  const handleCancel = async () => {
    if (!isConfirm){
      console.log("close report form");
      setOpen(false);   
    }else{
      console.log("delete report");
      await deleteReport(formData.reporte.id);
      clearReportPreview();
      setIsConfirm(false);
      setOpen(false);   
    }
  };

  const handleOpenConfirm = () => {
    console.log('Open confirm');
    //setOpen(!open);
    setOpenConfirm(true);
    setIsConfirm(true);
  }

  useEffect(() => {
    //console.log('⏳ Ejecutando fetchCategories...');
    fetchCategories();
    //fetchReports();
  }, []);  

  useEffect(() => {
    setFormData({
      audio: '',
      imagen: '',
      reporte: {        
        id: parseInt(reportPreview.id) || '',  
        titulo: reportPreview.titulo || '',
        descripcion: reportPreview.descripcionDespuesDeIa || '',
        latitud: reportPreview.latitud || -0.3460,
        longitud: reportPreview.longitud ||-0.5838,
        categoriaId: reportPreview.categoriaId || '',
        usuarioId: reportPreview.usuarioId || user?.id 
      }
    });
    setPreviewImageFileName(reportPreview.urlImagen || '');
     // Si ya se cargó la posición, actualizamos solo latitud y longitud
    if (!loadingLocation && position ) {
      setFormData(prev => ({
        ...prev,
        reporte: {
          ...prev.reporte,
          latitud: position[0],
          longitud: position[1]
        }
      }));

    if (!loadingUser){
      setFormData(prev => ({
        ...prev,
        reporte: {
          ...prev.reporte,
          usuarioId: user?.id 
        }
      }));
    }
      //console.log(`latitud: ${position[0]}, longitud: ${position[1]}`);
    }
  }, [reportPreview, loadingLocation, loadingUser]);

  
 
  //console.log(user );

  return (    
    <Sheet open={open} onOpenChange={setOpen}>

      <ConfirmReport open={openConfirm} setOpen={setOpenConfirm} setOpenParent ={setOpen} setIsConfirm={setIsConfirm}/>
      <SheetTrigger        
        className={`fixed bottom-48 lg:bottom-40 right-7 ${(!user) ? 'hidden' : ''}`}
        onClick={() => setOpen(true)}
      >
        <ButtonAddNewReport />
      </SheetTrigger>          
        <SheetContent className="overflow-y-auto px-4 flex flex-col gap-2">
          <form onSubmit={handleSubmit} >
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
                <img src={(previewImageFileName != '' ? previewImageFileName : noImageSvg)}
                  className={`w-full h-32 bg-slate-200 ${(previewImageFileName != '') ? 'object-cover' : ''} `}
                  alt="Vista previa de la Imagen del reporte" 
                />
                {
                (!isConfirm)?
                <div className="flex flex-row gap-6">
                  {/* Sacar foto */}
                  <input  disabled={loadingReport}
                    type="file"
                    id="imagen"
                    accept="image/*"
                    capture="environment"
                    onChange={handleClickBtnImg}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagen02"
                    className="bg-lime-300 rounded-[16px] hover:bg-lime-200 px-2 py-2 flex flex-col items-center justify-center w-[120px] h-[93px] gap-2  cursor-pointer"                    
                  >
                    <LuCamera className="h-6 w-fit" />
                    <span>Tomar foto</span>
                  </label>

                    {/* subir imagen */}
                  <input  disabled={loadingReport }
                    type="file"
                    id="imagen02"
                    accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
                    onChange={handleClickBtnImg}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagen02"
                    className="bg-lime-300 rounded-[16px] hover:bg-lime-200 px-2 py-2 flex flex-col items-center justify-center w-[120px] h-[93px] gap-2  cursor-pointer"
                  >
                    <LuImagePlus  className="h-6 w-fit" />
                    <span>Subir foto</span>
                  </label>
                </div>
              : ''
              }
              </div>
              {/* Categoría */}
              <div className="grid gap-3">
                <Label htmlFor="category" className="font-semibold">
                  Categoría *
                </Label>
                <Select disabled={loadingReport}
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
                <Input  disabled={loadingReport}
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
                  <Textarea  disabled={loadingReport}
                    id="descripcion"
                    value={formData.reporte.descripcion}
                    maxLength="400"
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
                        Máximo 400 caracteres
                      </span>
                    )}
                    <span
                      className={`text-sm ml-auto ${
                        charCount.descripcion > 400
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}
                    >
                      {charCount.descripcion}/400
                    </span>
                  </div>
                  {
                    (!isConfirm)?
                    <div className="absolute right-6 bottom-8">
                    <input   disabled={loadingReport}
                      type="file"
                      id="audio"
                      accept="audio/*"
                      capture="user"
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
                  :''
                  }
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-2">
              <Button  
                type="submit"
                className={`w-full rounded-[10px] gap-2 ${
                  (isFormValid && !loadingReport)
                    ? 'bg-lime-300 text-black hover:bg-lime-400'
                    : 'bg-gray-300 text-gray-800'
                }`}
                disabled={!isFormValid || loadingReport }
              >
                {
                (!isConfirm)
                ?(<><LuSparkles  className="h-5 w-fit"/><span>Generar reporte</span></>)
                : <span>Guardar cambios</span>
                }
              </Button>
              <Button  disabled={loadingReport  }
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

/*
# 4/3/2025
# Cambios:
- Fix bugs position - seleccion de formulario - 
- Cambios descripcion hasta 400 caracteres.
- Se oculta el boton de Agregar Reporte cuando el usuario no esta logeado.
# Observaciones:
- No se actualiza el pin en el mapa... fetchReports() en mapView ??

# Pruebas manuales hechas
## No poner geolocalizacion: 
- Aparece en la laguna de cachahua.
- El formulario de reporte OK
- reporte se envia y abre la preview,
### Click en reportar
- Se verifica en POST en el Backend.
- Cierra el formulario.
### Click en Volver
- Vuelve a abrir el formulario con el resultado de IA y los demas campos
- La descripcion de IA se carga en la descripcion.
#### Click en Guardar Cambios
- Se cierra el formulario
- Envia los datos por PUT a /api/reporte/api
- Se comprueba que se actualizan todos los campos en el EndPoint
#### Click en Cancelar.
- Se cierra el formulario.
- Se comprueba que no se creo ningun reporte en el endpoint 
*/
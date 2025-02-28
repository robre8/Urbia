import { useState } from 'react';
import { useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';

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
import { LuMic, LuCamera } from 'react-icons/lu';

const reportOptions = [
  { id: 0, value: 'seguridad', label: 'Seguridad' },
  { id: 1, value: 'infraestructura', label: 'Infraestructura' },
  { id: 2, value: 'sociales', label: 'Eventos sociales' },
  { id: 3, value: 'salud', label: 'Salud' }
];

const NewReportForm = () => {
  const [formData, setFormData] = useState({
    reportTypeId: '',
    title: '',
    description: '',
    image: null,
    audio: null
  });

  const [errors, setErrors] = useState({
    reportTypeId: false,
    title: false,
    description: false
  });

  const [charCount, setCharCount] = useState({
    title: 0,
    description: 0
  });

  const [open, setOpen] = useState(false);
  const { categories, fetchCategories, loading, error } = useCategoryStore();


  const validateForm = () => {
    const newErrors = {
      reportTypeId: !formData.reportTypeId,
      title: !formData.title || formData.title.length > 50,
      description: !formData.description || formData.description.length > 200
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      // Enviar formulario
      console.log('Formulario válido:', formData);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Actualizar conteo de caracteres
    if (name === 'title' || name === 'description') {
      setCharCount(prev => ({ ...prev, [name]: value.length }));
    }

    // Limpiar errores al editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleClickBtnImg = e => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    console.log('click on image load');
  };

  const handleClickBtnAudio = e => {
    setFormData(prev => ({ ...prev, audio: e.target.files[0] }));
    //e.preventDefault();
    console.log('click on Audio load');
  };

  // Función para cancelar y cerrar
  const handleCancel = () => {
    console.log('close sheet');
    setOpen(false);
    // Opcional: resetear el formulario
    // setFormData({
    //   reportTypeId: '',
    //   title: '',
    //   description: '',
    //   image: null,
    //   audio: null
    // });
    // setErrors({
    //   reportTypeId: false,
    //   title: false,
    //   description: false
    // });
  };

  useEffect(() => {
    console.log('⏳ Ejecutando fetchCategories...');
    fetchCategories();
  }, []);


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className='fixed bottom-48 lg:bottom-40 right-7'
        onClick={() => setOpen(true)}
      >
        <ButtonAddNewReport />
      </SheetTrigger>
      <SheetContent className='overflow-y-auto px-4 flex flex-col gap-2'>
        <form onSubmit={handleSubmit}>
          <SheetHeader className='space-y-2'>
            <SheetTitle className='text-2xl font-bold text-gray-900 p-4'>
              Reportar incidente
            </SheetTitle>
            <SheetDescription>
              Por favor, completa los siguientes campos para reportar un
              incidente.
            </SheetDescription>
          </SheetHeader>

          <div className='grid gap-8 py-4'>
            {/* Imagen */}
            <div className='grid gap-3'>
              <Label htmlFor='image' className='font-semibold'>
                Imagen
              </Label>
              {/* <Button variant="outline" className="bg-lime-300 hover:bg-lime-200" onClick={handleClickBtnImg}>
                Elige o toma una foto
              </Button> */}
              <input
                type='file'
                id='image'
                accept='image/*'
                onChange={handleClickBtnImg}
                className='hidden'
              />
              <label
                htmlFor='image'
                className='bg-lime-300 rounded-[5px] hover:bg-lime-200  px-4 py-2 flex justify-center gap-4 cursor-pointer '
              >
                <LuCamera className='h-5  w-fit' />
                Elige o toma una foto
              </label>
            </div>

            {/* Categoría */}
            <div className='grid gap-3'>
              <Label htmlFor='category' className='font-semibold'>
                Categoría *
              </Label>
              <Select
                value={formData.reportTypeId}
                onValueChange={value =>
                  handleInputChange('reportTypeId', value)
                }
                className={errors.reportTypeId ? 'border-red-500' : ''}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Tipo de reporte' />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem disabled>Cargando categorías...</SelectItem>
                  ) : error ? (
                    <SelectItem disabled>Error al cargar categorías</SelectItem>
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

              {errors.reportTypeId && (
                <span className='text-red-500 text-sm'>
                  Este campo es requerido
                </span>
              )}
            </div>

            {/* Título */}
            <div className='grid gap-3'>
              <Label htmlFor='title' className='font-semibold'>
                Título *
              </Label>
              <Input
                id='title'
                value={formData.title}
                maxLength='50'
                onChange={e => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
                placeholder='Nombre del reporte'
              />
              <div className='flex justify-between'>
                {errors.title && (
                  <span className='text-red-500 text-sm'>
                    Máximo 50 caracteres
                  </span>
                )}
                <span
                  className={`text-sm ml-auto ${
                    charCount.title > 50 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {charCount.title}/50
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className='grid gap-3'>
              <Label htmlFor='description' className='font-semibold'>
                Descripción *
              </Label>
              <div className='relative'>
                <Textarea
                  id='description'
                  value={formData.description}
                  maxLength='200'
                  onChange={e =>
                    handleInputChange('description', e.target.value)
                  }
                  className={`resize-none h-64 pb-10 ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder='Descripción del reporte'
                />
                <div className='flex justify-between mt-2'>
                  {errors.description && (
                    <span className='text-red-500 text-sm'>
                      Máximo 100 caracteres
                    </span>
                  )}
                  <span
                    className={`text-sm ml-auto ${
                      charCount.description > 200
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {charCount.description}/200
                  </span>
                </div>
                <div className='absolute right-6 bottom-8'>
                  <input
                    type='file'
                    id='audio'
                    accept='audio/*'
                    onChange={handleClickBtnAudio}
                    className='hidden'
                  />
                  <label
                    htmlFor='audio'
                    className='bg-lime-300 hover:bg-lime-200 rounded-[5px] p-2 cursor-pointer inline-block'
                  >
                    <LuMic className='h-5 w-5' />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-center gap-2 '>
            <Button
              type='submit'
              className='bg-gray-300 text-gray-800 hover:bg-gray-400 w-full rounded-[10px]'
            >
              Reportar
            </Button>
            <Button
              type='button'
              className='hover:bg-gray-500 w-full rounded-[10px]'
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

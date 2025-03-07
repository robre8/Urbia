import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
import { useUserAuth } from '@/lib/store/useUserAuth';
import { useUserLocation } from '@/components/mapview/hooks/useUserLocation';
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
import { LuMic, LuCamera, LuSparkles, LuImagePlus } from 'react-icons/lu';
import noImageSvg from '@/assets/svgs/no-image-svgrepo-com.svg';
import ConfirmReport from '@/features/NewReportForm/ConfirmReport';
import ButtonAddNewReport from '@/features/NewReportForm/ButtonAddNewReport';

const INITIAL_FORM = {
  audio: '',
  imagen: '',
  reporte: {
    id: '',
    titulo: '',
    descripcion: '',
    latitud: 0,
    longitud: 0,
    categoriaId: '',
    usuarioId: ''
  }
};

export default function CleanReportForm() {
  const { categories, fetchCategories, loading: loadingCategories, error: categoryError } = useCategoryStore();
  const { loading: loadingReport, reportPreview, sendReport, editReport, clearReportPreview } = useReportsStore();
  const { user } = useUserAuth();
  const { position } = useUserLocation();

  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState({ titulo: 0, descripcion: 0 });

  // Estados y refs para grabación de audio
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const intervalRef = useRef(null);
  const [chunks, setChunks] = useState([]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setPreviewImage('');
    setErrors({});
    setCharCount({ titulo: 0, descripcion: 0 });
    setRecording(false);
    setRecordingTime(0);
    setChunks([]);
  }, []);

  // Carga categorías
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Actualiza formData y preview cuando llega un reporte a editar o la posición
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      reporte: {
        ...prev.reporte,
        id: reportPreview?.id || '',
        titulo: reportPreview?.titulo || '',
        descripcion: reportPreview?.descripcionDespuesDeIa || '',
        latitud: reportPreview?.latitud || (position ? position[0] : 0),
        longitud: reportPreview?.longitud || (position ? position[1] : 0),
        categoriaId: reportPreview?.categoriaId || '',
        usuarioId: reportPreview?.usuarioId || (user ? user.id : '')
      }
    }));
    setPreviewImage(reportPreview?.urlImagen || '');
  }, [reportPreview, position, user]);

  // Valida formulario
  useEffect(() => {
    const { categoriaId, titulo, descripcion } = formData.reporte;
    const newErrors = {
      categoriaId: !categoriaId,
      titulo: !titulo || titulo.length > 50,
      descripcion: !descripcion || descripcion.length > 400
    };
    setErrors(newErrors);
  }, [formData]);

  // Si no hay errores -> es válido
  const isValid = useMemo(() => {
    return !Object.values(errors).some(e => e);
  }, [errors]);

  // Manejo de inputs
  const handleInputChange = (field, value, type = 'reporte') => {
    if (type === 'reporte') {
      setFormData(prev => ({
        ...prev,
        reporte: { ...prev.reporte, [field]: value }
      }));
      if (field === 'titulo' || field === 'descripcion') {
        setCharCount(prev => ({ ...prev, [field]: value.length }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (field, file, previewSetter) => {
    if (field === 'imagen') {
      previewSetter(URL.createObjectURL(file));
    }
    handleInputChange(field, file, 'other');
  };

  // Inicia grabación
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) {
          setChunks(prev => [...prev, e.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setFormData(prev => ({ ...prev, audio: blob }));
        setChunks([]);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setRecordingTime(0);

      // Cada segundo actualizamos el tiempo
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('No se pudo iniciar la grabación:', error);
    }
  };

  // Detiene grabación
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Limpia interval si se desmonta el componente mientras graba
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Envío o edición
  const handleSubmit = async e => {
    e.preventDefault();
    if (!isValid) return;

    const fd = new FormData();
    fd.append('reporte', new Blob([JSON.stringify(formData.reporte)], { type: 'application/json' }));

    if (!isConfirm) {
      if (formData.audio) {
        fd.append('audio', formData.audio);
      }
      if (formData.imagen) {
        fd.append('imagen', formData.imagen);
      }
      await sendReport(fd);
      setOpenConfirm(true);
      setIsConfirm(true);
    } else {
      await editReport(formData.reporte);
      clearReportPreview();
      setIsConfirm(false);
      setOpen(false);
      resetForm();
    }
  };

  // Cancelar
  const handleCancel = async () => {
    if (!isConfirm) {
      setOpen(false);
      resetForm();
    } else {
      await useReportsStore.getState().deleteReport(formData.reporte.id);
      clearReportPreview();
      setIsConfirm(false);
      setOpen(false);
      resetForm();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <ConfirmReport
        open={openConfirm}
        setOpen={setOpenConfirm}
        setOpenParent={setOpen}
        setIsConfirm={setIsConfirm}
      />
      <SheetTrigger
        className={`fixed bottom-48 lg:bottom-40 right-7 ${!user ? 'hidden' : ''}`}
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
            <SheetDescription />
          </SheetHeader>

          <div className="grid gap-8 py-4">
            {/* Imagen */}
            <div className="grid gap-3">
              <Label htmlFor="imagen">Imagen</Label>
              <img
                src={previewImage || noImageSvg}
                className={`w-full h-32 bg-slate-200 ${previewImage ? 'object-cover' : ''}`}
                alt="Vista previa"
              />
              {!isConfirm && (
                <div className="flex gap-6">
                  <input
                    disabled={loadingReport}
                    type="file"
                    id="imagen"
                    accept="image/*"
                    capture="environment"
                    onChange={e => handleFileChange('imagen', e.target.files[0], setPreviewImage)}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagen"
                    className="bg-lime-300 rounded-[16px] hover:bg-lime-200 px-2 py-2 flex flex-col items-center justify-center w-[120px] h-[93px] gap-2 cursor-pointer"
                  >
                    <LuCamera className="h-6" />
                    <span>Tomar foto</span>
                  </label>

                  <input
                    disabled={loadingReport}
                    type="file"
                    id="imagen02"
                    accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
                    onChange={e => handleFileChange('imagen', e.target.files[0], setPreviewImage)}
                    className="hidden"
                  />
                  <label
                    htmlFor="imagen02"
                    className="bg-lime-300 rounded-[16px] hover:bg-lime-200 px-2 py-2 flex flex-col items-center justify-center w-[120px] h-[93px] gap-2 cursor-pointer"
                  >
                    <LuImagePlus className="h-6" />
                    <span>Subir foto</span>
                  </label>
                </div>
              )}
            </div>

            {/* Categoría */}
            <div className="grid gap-3">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select
                disabled={loadingReport}
                value={formData.reporte.categoriaId}
                onValueChange={value => handleInputChange('categoriaId', value)}
                className={errors.categoriaId ? 'border-red-500' : ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem disabled>Cargando categorías...</SelectItem>
                  ) : categoryError ? (
                    <SelectItem disabled>Error al cargar categorías</SelectItem>
                  ) : categories.length === 0 ? (
                    <SelectItem disabled>No hay categorías</SelectItem>
                  ) : (
                    categories.map((cat, i) => (
                      <SelectItem
                        key={cat.id ?? i}
                        value={cat.id?.toString() || i.toString()}
                      >
                        {cat.nombre || 'Sin nombre'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.categoriaId && (
                <span className="text-red-500 text-sm">Requerido</span>
              )}
            </div>

            {/* Título */}
            <div className="grid gap-3">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                disabled={loadingReport}
                value={formData.reporte.titulo}
                maxLength="50"
                onChange={e => handleInputChange('titulo', e.target.value)}
                className={errors.titulo ? 'border-red-500' : ''}
                placeholder="Nombre del reporte"
              />
              <div className="flex justify-between">
                {errors.titulo && (
                  <span className="text-red-500 text-sm">Máximo 50 caracteres</span>
                )}
                <span
                  className={`text-sm ${
                    charCount.titulo > 50 ? 'text-red-500' : 'text-gray-500'
                  }`}
                >
                  {charCount.titulo}/50
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="grid gap-3">
              <Label htmlFor="descripcion">Descripción *</Label>
              <div className="relative">
                <Textarea
                  id="descripcion"
                  disabled={loadingReport}
                  value={formData.reporte.descripcion}
                  maxLength="400"
                  onChange={e => handleInputChange('descripcion', e.target.value)}
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
                    className={`text-sm ${
                      charCount.descripcion > 400 ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {charCount.descripcion}/400
                  </span>
                </div>

                {/* Botón de audio */}
                {!isConfirm && (
                  <div className="absolute right-6 bottom-8 flex gap-2 items-center">
                    {/* Si no está grabando ni hay audio */}
                    {!recording && !formData.audio && (
                      <Button
                        disabled={loadingReport}
                        variant="default"
                        onClick={handleStartRecording}
                        className="bg-lime-300 hover:bg-lime-200 flex items-center gap-2"
                      >
                        <LuMic className="h-5" />
                        <span>Grabar</span>
                      </Button>
                    )}

                    {/* Si está grabando */}
                    {recording && (
                      <Button
                        disabled={loadingReport}
                        variant="destructive"
                        onClick={handleStopRecording}
                        className="bg-red-400 hover:bg-red-300 flex items-center gap-2"
                      >
                        <LuMic className="h-5 animate-pulse" />
                        <span>Grabando... {recordingTime}s</span>
                      </Button>
                    )}

                    {/* Si ya hay audio guardado y no está grabando */}
                    {!recording && formData.audio && (
                      <div className="flex items-center gap-2">
                        <Button
                          disabled={loadingReport}
                          variant="default"
                          onClick={handleStartRecording}
                          className="bg-lime-300 hover:bg-lime-200 flex items-center gap-2"
                        >
                          <LuMic className="h-5" />
                          <span>Regrabar</span>
                        </Button>
                        <span className="text-green-600 font-semibold">
                          Audio guardado
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de enviar/cancelar */}
          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={!isValid || loadingReport}
              className={`w-full rounded-[10px] gap-2 ${
                isValid && !loadingReport
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
              disabled={loadingReport}
              className="w-full rounded-[10px] hover:bg-gray-500"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

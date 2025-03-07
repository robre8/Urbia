import { useState, useEffect } from 'react';
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
import ConfirmReport from '@/features/NewReportForm/ConfirmReport';
import ButtonAddNewReport from '@/features/NewReportForm/ButtonAddNewReport';

// Import our custom components and hooks
import { AudioRecorder } from './components/AudioRecorder';
import { ImageUploader } from './components/ImageUploader';
import { FormFields } from './components/FormFields';
import { FormButtons } from './components/FormButtons';
import { useAudioRecording } from './hooks/useAudioRecording';
import { useFormValidation } from './hooks/useFormValidation';
import { useImageUpload } from './hooks/useImageUpload';
import { toast } from "sonner";

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

  // UI state
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  // Custom hooks
  const {
    formData,
    setFormData,
    errors,
    charCount,
    isValid,
    handleInputChange,
    resetForm
  } = useFormValidation(INITIAL_FORM);

  const {
    recording,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecording();
  const {
    previewImage,
    imageFile,
    imageError,
    handleFileChange,
    resetImage
  } = useImageUpload();
  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  // Clear form when component mounts
  useEffect(() => {
    handleReset();
    clearReportPreview();
  }, []);
  // Update your handleReset function
  const handleReset = () => {
    resetForm();
    resetImage();
    // Check if resetRecording exists before calling it
    if (typeof resetRecording === 'function') {
      resetRecording();
    }
    clearReportPreview(); // Clear the preview from store
  };
  // Update your handleCancel function
  const handleCancel = async () => {
    if (!isConfirm) {
      setOpen(false);
      handleReset();
    } else {
      await useReportsStore.getState().deleteReport(formData.reporte.id);
      clearReportPreview();
      setIsConfirm(false);
      setOpen(false);
      handleReset();
    }
  };
  // Also clear form when sheet is closed
  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);
  // Update form data when report preview or position changes
  useEffect(() => {
    if (reportPreview || position || user) {
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
    }
  }, [reportPreview, position, user, setFormData]);
  const handleSubmit = async e => {
    e.preventDefault();
    if (!isValid || imageError) {
      toast.error("Por favor, corrige los errores del formulario");
      return;
    }
  
    try {
      // Create FormData exactly like in the working NewReportForm
      const formDataToSend = new FormData();
      formDataToSend.append(
        'reporte',
        new Blob([JSON.stringify(formData.reporte)], { type: 'application/json' })
      );
      
      if (!isConfirm) {
        // Append files directly without additional parameters
        if (audioBlob) {
          formDataToSend.append("audio", audioBlob);
        }
        
        if (imageFile) {
          // Just append the file without specifying filename
          formDataToSend.append("imagen", imageFile);
        }
        
        console.log('Se envia a sendReport.', formData);
        await sendReport(formDataToSend);
        setOpenConfirm(true);
        setIsConfirm(true);
      } else {
        await editReport(formData.reporte);
        clearReportPreview();
        setIsConfirm(false);
        setOpen(false);
        handleReset();
        
        toast.success("Reporte actualizado correctamente");
      }
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      toast.error("No se pudo enviar el reporte. Intenta de nuevo más tarde.");
    }
  };
  // Update component props to match the new structure
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
            {/* Image Uploader Component */}
            <ImageUploader
              previewImage={previewImage}
              onFileChange={handleFileChange}
              disabled={loadingReport}
              isConfirm={isConfirm}
              imageError={imageError}
            />
            {/* Form Fields Component */}
            <FormFields
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
              charCount={charCount}
              categories={categories}
              loadingCategories={loadingCategories}
              categoryError={categoryError}
              disabled={loadingReport}
            />
            {/* Audio Recorder Component (only show if not in confirm mode) */}
            {!isConfirm && (
              <div className="relative h-10">
                <AudioRecorder
                  isRecording={recording}
                  recordingTime={recordingTime}
                  onStart={startRecording}
                  onStop={stopRecording}
                  hasAudio={!!audioBlob}
                  disabled={loadingReport}
                />
              </div>
            )}
          </div>
          {/* Form Buttons Component */}
          <FormButtons
            isValid={isValid}
            isConfirm={isConfirm}
            loading={loadingReport}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </form>
      </SheetContent>
    </Sheet>
  );
}

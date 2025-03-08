import { useState, useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
import useMapStore from '@/lib/store/useMapStore'; // Add this import
import { useUserAuth } from '@/lib/store/useUserAuth';
import { useUserLocation } from '@/components/mapview/hooks/useUserLocation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import ConfirmReport from '@/features/NewReportForm/ConfirmReport';
import ButtonAddNewReport from '@/features/NewReportForm/ButtonAddNewReport';

// Import our custom components and hooks
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
  const { selectedCoords } = useMapStore(); // Get selected coordinates from map store

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
  // Update form data when report preview, selected coordinates, or position changes
  useEffect(() => {
    if (reportPreview || selectedCoords || position || user) {
      setFormData(prev => ({
        ...prev,
        reporte: {
          ...prev.reporte,
          id: reportPreview?.id || '',
          titulo: reportPreview?.titulo || '',
          descripcion: reportPreview?.descripcionDespuesDeIa || '',
          // Use selected coordinates from map click if available, otherwise use user position
          latitud: reportPreview?.latitud || 
                  (selectedCoords ? selectedCoords[0] : 
                  (position ? position[0] : 0)),
          longitud: reportPreview?.longitud || 
                   (selectedCoords ? selectedCoords[1] : 
                   (position ? position[1] : 0)),
          categoriaId: reportPreview?.categoriaId || '',
          usuarioId: reportPreview?.usuarioId || (user ? user.id : '')
        }
      }));
    }
  }, [reportPreview, selectedCoords, position, user, setFormData]);
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
        toast.success("Reporte creado exitosamente"); // Add success toast here
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
      
      {/* Hidden trigger for programmatic opening from map click toast */}
      <SheetTrigger 
        id="open-report-form" 
        className="hidden" 
        onClick={() => setOpen(true)}
      />
      
      <SheetContent className="px-3 py-2 flex flex-col h-full max-h-screen overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <SheetHeader className="py-1">
            <SheetTitle className="text-lg font-bold text-gray-900">
              Reportar incidente
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {/* Image Uploader Component */}
            <ImageUploader
              previewImage={previewImage}
              onFileChange={handleFileChange}
              disabled={loadingReport}
              isConfirm={isConfirm}
              imageError={imageError}
            />
            {/* Form Fields Component with Audio Recorder integrated */}
            <FormFields
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
              charCount={charCount}
              categories={categories}
              loadingCategories={loadingCategories}
              categoryError={categoryError}
              disabled={loadingReport}
              // Pass audio recorder props
              isRecording={recording}
              recordingTime={recordingTime}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              hasAudio={!!audioBlob}
            />
            {/* Remove standalone AudioRecorder */}
          </div>
          {/* Form Buttons Component */}
          <FormButtons
            isValid={isValid}
            isConfirm={isConfirm}
            loading={loadingReport}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            className="mt-1 py-1"
          />
        </form>
      </SheetContent>
    </Sheet>
  );
}

import { useState, useEffect } from 'react';
import useCategoryStore from '@/lib/store/useCategoryStore';
import useReportsStore from '@/lib/store/useReportsStore';
import useMapStore from '@/lib/store/useMapStore'; // Add this import
import { useUserAuth } from '@/lib/store/useUserAuth';
import { useUserLocation } from '@/components/mapview/hooks/useUserLocation';
import { useReverseGeocode } from '@/components/mapview/hooks/useReverseGeocode'; // Importamos el hook
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import ConfirmReport from '@/features/reports/form/components/ConfirmReport';

// Import our custom components and hooks
import { ImageUploader } from './components/ImageUploader';
import { FormFields } from './components/FormFields';
import { FormButtons } from './components/FormButtons';
import { useAudioRecording } from './hooks/useAudioRecording';
import { useFormValidation } from './hooks/useFormValidation';
import { useImageUpload } from './hooks/useImageUpload';
import { toast } from 'sonner';

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
  const {
    categories,
    fetchCategories,
    loading: loadingCategories,
    error: categoryError
  } = useCategoryStore();
  // Import deleteReport from useReportsStore
  const {
    loading: loadingReport,
    reportPreview,
    sendReport,
    editReport,
    clearReportPreview,
    deleteReport // Add this import
  } = useReportsStore();
  const { user } = useUserAuth();
  const { position } = useUserLocation();
  const { selectedCoords } = useMapStore(); // Get selected coordinates from map store

  // Usamos el hook para obtener la dirección basada en las coordenadas seleccionadas
  const coords = selectedCoords || position;
  const { address, loadingAddress } = useReverseGeocode(coords);
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
  const { previewImage, imageFile, imageError, handleFileChange, resetImage } =
    useImageUpload();
  // Load categories on mount
  useEffect(() => {
    // Only fetch categories if they're not already loaded
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);
  // Clear form when component mounts
  useEffect(() => {
    handleReset();
    clearReportPreview();
  }, []);
  // Add or modify the handleReset function to ensure it doesn't delete anything
  const handleReset = () => {
    resetForm();
    resetImage();
    resetRecording();
    // Always clear the report preview when resetting the form
    clearReportPreview();
    setOpen(false);
  };
  // Modify the handleCancel function to handle different cancel scenarios
  const handleCancel = () => {
    // Get the source of edit from the store
    const editSource = useReportsStore.getState().editSource || 'unknown';
    
    // If we're in edit mode and have a report ID
    if (isConfirm && reportPreview?.id) {
      // If editing from creation, delete the report
      if (editSource === 'creation') {
        deleteReport(reportPreview.id)
          .then(() => {
            toast.success('Reporte eliminado correctamente');
            setOpen(false);
            setIsConfirm(false);
          })
          .catch((error) => {
            console.error('Error deleting report:', error);
            toast.error('Error al eliminar el reporte');
          });
      } else {
        // For edits from MyReports or ReportView: Cancel should just close the form without deleting
        setOpen(false);
        setIsConfirm(false);
        // Clear the preview and reset edit mode
        useReportsStore.setState({ 
          reportPreview: null,
          isEditMode: false,
          editSource: null,
          originalCoordinates: null
        });
      }
    } else {
      // For new reports, just reset everything
      handleReset();
    }
  };
  // Also clear form when sheet is closed
  useEffect(() => {
    if (!open) {
      handleReset();
      // Make sure isConfirm is reset when the form is closed
      setIsConfirm(false);
    }
  }, [open]);

  // Update form data when report preview, selected coordinates, or position changes
  useEffect(() => {
    // Check if we're in edit mode from the store
    const isEditMode = useReportsStore.getState().isEditMode;
    
    if (isEditMode && reportPreview) {
      setIsConfirm(true);
      // Reset the flag after we've used it
      useReportsStore.setState({ isEditMode: false });
    }
    
    if (reportPreview || selectedCoords || position || user) {
      setFormData(prev => ({
        ...prev,
        reporte: {
          ...prev.reporte,
          id: reportPreview?.id || '',
          titulo: reportPreview?.titulo || '',
          descripcion: reportPreview?.descripcionDespuesDeIa || '',
          // Use selected coordinates from map click if available, otherwise use user position
          latitud:
            reportPreview?.latitud ||
            (selectedCoords ? selectedCoords[0] : position ? position[0] : 0),
          longitud:
            reportPreview?.longitud ||
            (selectedCoords ? selectedCoords[1] : position ? position[1] : 0),
          categoriaId: reportPreview?.categoriaId || '',
          usuarioId: reportPreview?.usuarioId || (user ? user.id : '')
        }
      }));
    }
  }, [reportPreview, selectedCoords, position, user, setFormData]);
  // Check how the form submission is handling the image file
  // Update your handleSubmit function to properly handle edit mode
  const handleSubmit = async e => {
    e.preventDefault();

    if (!isValid) return;

    // Create a new FormData object to properly handle file uploads
    const formDataToSend = new FormData();
    
    // Add report data as JSON with categoriaId as number
    const reportData = {
      ...formData.reporte,
      categoriaId: parseInt(formData.reporte.categoriaId, 10),
      // When in edit mode, use the form data coordinates directly
      // This ensures we use the original coordinates that were preserved
      latitud: formData.reporte.latitud,
      longitud: formData.reporte.longitud,
      usuarioId: user?.id || ''
    };

    // Log all form data for debugging
    console.log('Form data being submitted:', {
      id: formData.reporte.id,
      titulo: formData.reporte.titulo,
      descripcion: formData.reporte.descripcion,
      categoriaId: formData.reporte.categoriaId,
      convertedCategoriaId: reportData.categoriaId
    });

    // Add report data as a Blob with application/json content type
    formDataToSend.append(
      'reporte',
      new Blob([JSON.stringify(reportData)], { type: 'application/json' })
    );

    // Add image file if it exists - this is critical for the image to be sent
    if (imageFile) {
      formDataToSend.append('imagen', imageFile);
      console.log(
        'Image file added to form data:',
        imageFile.name,
        imageFile.type,
        imageFile.size
      );
    } else if (reportPreview?.urlImagen) {
      // If we don't have a new image but have an existing one in the preview,
      // make sure to include the URL in the report data
      console.log('Using existing image URL from preview:', reportPreview.urlImagen);
    }

    // Add audio blob if it exists
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'audio.webm', {
        type: 'audio/webm'
      });
      formDataToSend.append('audio', audioFile);
    }

    try {
      // Use editReport if we're in edit mode (isConfirm), otherwise use sendReport
      if (isConfirm && formData.reporte.id) {
        const updatedReport = await editReport(formData.reporte.id, formDataToSend);
        console.log('Report updated successfully:', updatedReport);
        toast.success('Reporte actualizado correctamente');
        
        // Don't open the confirmation dialog for edits
        setOpen(false);
        setIsConfirm(false);
        
        // Instead of clearing everything, we should update the report in the list
        // Get the preserved report ID from the store
        
        // Only clear the preview, but don't remove the report from the list
        useReportsStore.setState({ 
          reportPreview: null,
          isEditMode: false,
          preserveReportId: null
        });
        
        // Reset form state but don't clear everything
        resetForm();
        resetImage();
        resetRecording();
        
        // IMPORTANT: Don't set openConfirm to true for edits
        // This is likely causing the error in ConfirmReport
      } else {
        const result = await sendReport(formDataToSend);
        console.log('Report created successfully:', result);
        // Only open confirmation for new reports
        setOpenConfirm(true);
      }
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error(isConfirm ? 'Error al actualizar el reporte' : 'Error al enviar el reporte');
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
        address={address}
        loadingAddress={loadingAddress}
      />
      {/* Keep the hidden trigger for programmatic opening from map click toast */}
      <SheetTrigger
        id='open-report-form'
        className='hidden'
        onClick={() => setOpen(true)}
      />

      <SheetContent className='px-3 py-2 flex flex-col h-full w-full max-h-screen overflow-hidden'>
        <form onSubmit={handleSubmit} className='flex flex-col h-full'>
          <SheetHeader className='py-1'>
            <SheetTitle className='text-lg font-bold text-gray-900'>
              {isConfirm ? 'Editar reporte' : 'Reportar incidente'}
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-2 flex-1 overflow-y-auto'>
            {/* Image Uploader Component */}
            <ImageUploader
              previewImage={previewImage || (reportPreview?.urlImagen)}
              onFileChange={(name, file) => {
                console.log("Image change in CleanReportForm:", name, file ? "file exists" : "file is null");
                handleFileChange(name, file);
                
                // If clearing the image, also update the reportPreview in the store
                if (!file) {
                  console.log("Clearing image in reportPreview");
                  if (reportPreview) {
                    const updatedPreview = {...reportPreview};
                    delete updatedPreview.urlImagen; // Remove the image URL property
                    // Check if setReportPreview exists in the store
                    if (useReportsStore.getState().setReportPreview) {
                      useReportsStore.getState().setReportPreview(updatedPreview);
                    } else {
                      // If setReportPreview doesn't exist, we need to update the store differently
                      // This is a fallback in case the store structure is different
                      console.log("setReportPreview not found in store, using alternative update method");
                      useReportsStore.setState({ reportPreview: updatedPreview });
                    }
                  }
                }
              }}
              disabled={loadingReport}
              isConfirm={isConfirm} // Pass isConfirm but don't use it to disable the clear button
              imageError={imageError}
            />
            
            {/* Mostramos la dirección antes del componente FormFields */}
            <div className='flex items-center gap-2 px-1 py-1 bg-gray-50 rounded-md text-[10px] border'>
              {loadingAddress ? (
                <span className='text-gray-500'>Obteniendo dirección...</span>
              ) : address ? (
                <span className='text-gray-700'>{address}</span>
              ) : (
                <span className='text-gray-500'>
                  Ubicación sin dirección disponible
                </span>
              )}
            </div>

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
            onCancel={handleCancel} // Use our updated handleCancel function
            className='mt-1 py-1'
          />
        </form>
      </SheetContent>
    </Sheet>
  );
}

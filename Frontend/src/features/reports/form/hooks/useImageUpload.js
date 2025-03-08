import { useState } from 'react';

export function useImageUpload() {
  const [previewImage, setPreviewImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  
  // Tamaño máximo: 10MB en bytes
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const handleFileChange = (field, file) => {
    // Si file es null, significa que estamos eliminando la imagen
    if (file === null) {
      console.log("Imagen eliminada");
      setPreviewImage('');
      setImageFile(null);
      setImageError('');
      return;
    }
    
    if (file) {
      // Validar tamaño del archivo
      if (file.size > MAX_FILE_SIZE) {
        setImageError('La imagen no debe superar los 10MB');
        return;
      }
      
      setImageError('');
      setPreviewImage(URL.createObjectURL(file));
      setImageFile(file);
      
      // Add debug logging
      console.log("Image file set in hook:", file.name, file.type, file.size);
    }
  };

  const resetImage = () => {
    setPreviewImage('');
    setImageFile(null);
    setImageError('');
  };

  return {
    previewImage,
    setPreviewImage,
    imageFile,
    imageError,
    handleFileChange,
    resetImage
  };
}
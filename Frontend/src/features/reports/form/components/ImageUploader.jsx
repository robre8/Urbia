import { Label } from '@/components/ui/label';
import { LuCamera, LuImagePlus } from 'react-icons/lu';
import noImageSvg from '@/assets/svgs/no-image-svgrepo-com.svg';
import { useState } from 'react';

export function ImageUploader({ previewImage, onFileChange, disabled, isConfirm, imageError }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (fieldName, file) => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onFileChange(fieldName, null, 'La imagen no debe exceder 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        onFileChange(fieldName, null, 'El archivo debe ser una imagen');
        return;
      }
      
      // Process the file normally
      onFileChange(fieldName, file);
    } catch (error) {
      console.error('Error processing image:', error);
      onFileChange(fieldName, null, 'Error al procesar la imagen');
    } finally {
      setIsLoading(false);    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="picture">Imagen</Label>
      <div className="relative">
        <input
          className="hidden"
          id="picture"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange('picture', e.target.files[0])}
          disabled={disabled || isLoading}
        />
        <label
          htmlFor="picture"
          className={`group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-input ${
            imageError ? 'border-destructive' : ''
          }`}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img src={noImageSvg} alt="No image" className="h-16 w-16" />
              <span className="text-sm text-muted-foreground">
                Haga clic para subir una imagen
              </span>
            </div>
          )}
          {!isConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover:opacity-100">
              {previewImage ? (
                <LuCamera className="h-8 w-8" />
              ) : (
                <LuImagePlus className="h-8 w-8" />
              )}
            </div>
          )}
        </label>
        {imageError && (
          <p className="mt-1 text-sm text-destructive">{imageError}</p>
        )}
      </div>
    </div>
  );
}

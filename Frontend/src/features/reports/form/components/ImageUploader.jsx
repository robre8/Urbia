import { Label } from '@/components/ui/label';
import { LuCamera, LuImagePlus, LuX } from 'react-icons/lu';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ImageUploader({ previewImage, onFileChange, disabled, isConfirm, imageError }) {
// Removed unused state variable
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [localPreviewImage, setLocalPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  // Use either the prop or local preview image
  const displayImage = previewImage || localPreviewImage;

  // Handle camera activation
  const handleCameraToggle = async () => {
    if (showCamera) {
      // Stop the camera if it's already active
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setShowCamera(false);
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setShowCamera(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  // Connect video element to stream when camera is active
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, videoRef]);
  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !stream) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    // Create a local preview URL from the canvas
    const localPreviewUrl = canvas.toDataURL('image/jpeg');
    setLocalPreviewImage(localPreviewUrl);
    
    // Convert to blob and create a file
    canvas.toBlob(blob => {
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      const event = { target: { files: [file] } };
      
      // Process the file normally
      onFileChange(event);
      
      // Stop the camera after capturing
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setShowCamera(false);
    }, 'image/jpeg');
  };
  // Handle file selection
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  // Handle file change (from input or drop)
  // In the ImageUploader component
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Pass the actual file object to the parent component
      onFileChange('imagen', file);
      
      // Log for debugging
      console.log("File selected:", file.name, file.type, file.size);
    };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const event = { target: { files: [files[0]] } };
      handleFileChange(event);
    }
  };
  // Clear the current image
  const clearImage = () => {
    setLocalPreviewImage(null);
    onFileChange({ target: { files: [] } });
  };
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="picture">Imagen</Label>
      
      <div className="flex items-center gap-4">
        {/* Drop zone / Image preview */}
        <div 
          ref={dropZoneRef}
          className={`relative w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden
            ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'}
            ${disabled || isConfirm ? 'opacity-70' : 'cursor-pointer'}
            ${showCamera ? 'hidden' : ''}`}
          onClick={!disabled && !isConfirm && !previewImage ? triggerFileInput : undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {displayImage ? (
            // Image preview
            <>
              <img 
                src={displayImage} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
              {!isConfirm && (
                <button 
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <LuX className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            // Empty state
            <div className="flex flex-col items-center gap-1 p-2 text-center">
              <LuImagePlus className="h-8 w-8 text-gray-400" />
              <p className="text-xs text-gray-500">
                Subir foto
              </p>
            </div>
          )}
        </div>
        
        {/* Camera button or preview */}
        {showCamera ? (
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              className="w-full h-full object-cover"
              onClick={capturePhoto}
            />
            <button 
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                handleCameraToggle();
              }}
            >
              <LuX className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button 
            type="button" 
            variant="secondary" 
            className="w-32 h-32 bg-lime-200 hover:bg-lime-300 text-black flex flex-col items-center justify-center"
            onClick={handleCameraToggle}
            disabled={disabled || isConfirm}
          >
            <LuCamera className="h-8 w-8 mb-1" />
            <span className="text-sm">Tomar foto</span>
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        id="picture"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      
      {imageError && (
        <p className="mt-1 text-sm text-destructive">{imageError}</p>
      )}
    </div>
  );
}

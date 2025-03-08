import { Label } from '@/components/ui/label';
import { LuCamera, LuImagePlus, LuX } from 'react-icons/lu';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ImageUploader({ previewImage, onFileChange, disabled, isConfirm, imageError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [localPreviewImage, setLocalPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [fullscreenCamera, setFullscreenCamera] = useState(false);
  
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
      setFullscreenCamera(false);
    } else {
      try {
        // Activar cámara en modo pantalla completa para móviles
        setFullscreenCamera(true);
        
        // Modificamos las opciones para usar la cámara trasera en móviles
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: { exact: "environment" } // Usar cámara trasera
          } 
        });
        setStream(mediaStream);
        setShowCamera(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Si falla con la cámara trasera, intentamos con cualquier cámara disponible
        try {
          console.log("Intentando con cualquier cámara disponible");
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          setShowCamera(true);
        } catch (fallbackErr) {
          console.error("Error accessing any camera:", fallbackErr);
          setFullscreenCamera(false);
        }
      }
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !stream) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert to file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
        onFileChange('imagen', file);
        setLocalPreviewImage(URL.createObjectURL(blob));
        
        // Cerrar la cámara después de tomar la foto
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
        setFullscreenCamera(false);
        setStream(null);
      }
    }, 'image/jpeg', 0.8);
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
  // Handle file selection - Esta función no se usa, puedes eliminarla
  // const triggerFileInput = () => {
  //   fileInputRef.current.click();
  // };

  // Handle file change (from input or drop)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Pass the actual file object to the parent component
    onFileChange('imagen', file);
    
    // Create a local preview for immediate display
    setLocalPreviewImage(URL.createObjectURL(file));
    
    // Log for debugging
    console.log("File selected in ImageUploader:", file.name, file.type, file.size);
  };

  // Estas funciones no se usan correctamente, deberías conectarlas a los eventos del div
  // o eliminarlas si no son necesarias
  // const handleDragEnter = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setIsDragging(true);
  // };

  // const handleDragLeave = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setIsDragging(false);
  // };

  // const handleDragOver = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  // };

/*   const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const event = { target: { files: [files[0]] } };
      handleFileChange(event);
    }
  }; */
  // Clear the current image
  const clearImage = () => {
    console.log("Ejecutando clearImage");
    setLocalPreviewImage(null);
    // Llamamos directamente a onFileChange con null
    onFileChange('imagen', null);
  };
  return (
    <div className="relative">
      {fullscreenCamera && showCamera ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4 bg-black flex justify-between items-center">
            <Button 
              type="button" 
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
                setShowCamera(false);
                setFullscreenCamera(false);
                setStream(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
            >
              <LuX size={24} />
            </Button>
            
            <Button 
              type="button" 
              onClick={capturePhoto}
              className=" border text-black rounded-full p-4 w-12 h-12 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-white"></div>
            </Button>
            
            <div className="w-10"></div> {/* Espacio para equilibrar el layout */}
          </div>
        </div>
      ) : (
        <>
          <Label htmlFor="imagen" className="text-sm">
            Imagen
          </Label>
          <div
            ref={dropZoneRef}
            className={`mt-1 flex justify-center rounded-lg border border-dashed px-6 py-4 ${
              isDragging ? 'border-lime-300 bg-lime-50' : 'border-gray-300'
            } ${imageError ? 'border-red-500' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                onFileChange('imagen', file);
              }
            }}
          >
            {displayImage ? (
              <div className="relative w-full">
                <img
                  src={displayImage}
                  alt="Preview"
                  className="mx-auto max-h-48 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  onClick={() => {
                    clearImage();
                  }}
                  className="absolute w-6 h-6 bg-gray-300 right-0 top-0 rounded-full bg-transparent p-1 text-white"
                  disabled={disabled || isConfirm}
                >
                  <LuX className="h-4 w-4 text-black hover:text-white" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <LuImagePlus className="mx-auto h-6 w-6 text-[#8958fa]" />
                <div className="mt-2 flex flex-col h-[20px] justify-center gap-2 text-sm text-gray-600 w-full">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-md bg-white font-semibold hover:text-lime-500"
                  >
                    <span>Arrastra y suelta tu archivo </span>
                    <span className='block'>o <span className="text-center text-[#8958fa]">selecciona</span></span>
                 
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          onFileChange('imagen', e.target.files[0]);
                        }
                      }}
                      ref={fileInputRef}
                      disabled={disabled}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF hasta 10MB</p>
              </div>
            )}
          </div>
          
          {/* Botón de tomar foto movido fuera del área punteada */}
          {!displayImage && (
            <Button
              type="button"
              onClick={handleCameraToggle}
              className="w-full bg-[#9bee5e] hover:bg-lime-500 text-black font-medium py-2 px-4 rounded-xl flex items-center justify-center mt-2"
              disabled={disabled}
            >
              <LuCamera className="mr-2 h-5 w-5" />
              Tomar otra foto
            </Button>
          )}
          
          {imageError && <p className="mt-1 text-xs text-red-500">{imageError}</p>}
        </>
      )}
    </div>
  );
}

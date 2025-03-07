import { Label } from '@/components/ui/label';
import { LuCamera, LuImagePlus } from 'react-icons/lu';
import noImageSvg from '@/assets/svgs/no-image-svgrepo-com.svg';

export function ImageUploader({ previewImage, onFileChange, disabled, isConfirm, imageError }) {
  return (
    <div className="grid gap-3">
      <Label htmlFor="imagen">Imagen</Label>
      <img
        src={previewImage || noImageSvg}
        className={`w-full h-20 bg-slate-200 ${previewImage ? 'object-cover' : ''}`}
        alt="Vista previa"
      />
      
      {imageError && (
        <p className="text-red-500 text-sm">{imageError}</p>
      )}
      
      {!isConfirm && (
        <div className="flex gap-6">
          <input
            disabled={disabled}
            type="file"
            id="imagen"
            accept="image/*"
            capture="environment"
            onChange={e => onFileChange('imagen', e.target.files[0])}
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
            disabled={disabled}
            type="file"
            id="imagen02"
            accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
            onChange={e => onFileChange('imagen', e.target.files[0])}
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
  );
}
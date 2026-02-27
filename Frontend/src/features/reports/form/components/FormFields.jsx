import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioRecorder } from './AudioRecorder';

export function FormFields({ 
  formData, 
  onChange, 
  errors, 
  charCount, 
  categories, 
  loadingCategories, 
  categoryError, 
  disabled,
  // Audio recorder props
  isRecording,
  recordingTime,
  onStartRecording,
  onStopRecording,
  hasAudio
}) {


  const handleCategoryChange = (value) => {
    // Convert to number
    const categoryId = parseInt(value, 10);
    

    
    // Pass the ID directly to the parent component
    onChange('categoriaId', categoryId);
  };

  // Rest of the component remains the same
  return (
    <div className="grid gap-2 py-1">
      <div className="grid gap-1.5">
        <Label htmlFor="categoria" className="text-sm">Categoría *</Label>
        <Select
          disabled={disabled}
          value={formData.reporte.categoriaId?.toString() || ""}
          onValueChange={handleCategoryChange}
          className={`text-sm ${errors.categoriaId ? 'border-red-500' : ''}`}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Tipo de reporte" />
          </SelectTrigger>
          <SelectContent>
            {loadingCategories ? (
              <SelectItem disabled className="text-sm">Cargando categorías...</SelectItem>
            ) : categoryError ? (
              <SelectItem disabled className="text-sm">Error al cargar categorías</SelectItem>
            ) : categories.length === 0 ? (
              <SelectItem disabled className="text-sm">No hay categorías</SelectItem>
            ) : (
              categories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id.toString()}
                  className="text-sm"
                >
                  {cat.nombre || cat.name || 'Sin nombre'}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.categoriaId && (
          <small className="text-red-500 text-xs">Requerido</small>
        )}
      </div>

      {/* Rest of the form fields remain unchanged */}
      <div className="grid gap-1.5">
        <Label htmlFor="titulo" className="text-sm">Título *</Label>
        <Input
          id="titulo"
          disabled={disabled}
          value={formData.reporte.titulo}
          maxLength="50"
          onChange={e => onChange('titulo', e.target.value)}
          className={`h-8 text-sm ${errors.titulo ? 'border-red-500' : ''}`}
          placeholder="Nombre del reporte"
        />
        <div className="flex justify-between">
          {errors.titulo && (
            <small className="text-red-500 text-xs">Máximo 50 caracteres</small>
          )}
          <span className={`text-xs ${charCount.titulo > 50 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount.titulo}/50
          </span>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="descripcion" className="text-sm">Descripción *</Label>
        <div className="relative">
          <Textarea
            id="descripcion"
            disabled={disabled}
            value={formData.reporte.descripcion}
            maxLength="200"
            onChange={e => onChange('descripcion', e.target.value)}
            className={`resize-none h-[110px] pb-8 text-sm ${errors.descripcion ? 'border-red-500' : ''}`}
            placeholder="Descripción del reporte"
          />
          <div className="absolute bottom-6 right-2">
            <AudioRecorder
              isRecording={isRecording}
              recordingTime={recordingTime}
              onStart={onStartRecording}
              onStop={onStopRecording}
              hasAudio={hasAudio}
              disabled={disabled}
            />
          </div>
          <div className="flex justify-between mt-1">
            {errors.descripcion && (
              <small className="text-red-500 text-xs">Máximo 200 caracteres</small>
            )}
            <small className={`text-xs ${charCount.descripcion > 200 ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount.descripcion}/200
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
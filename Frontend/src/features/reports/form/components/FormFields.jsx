import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FormFields({ 
  formData, 
  onChange, 
  errors, 
  charCount, 
  categories, 
  loadingCategories, 
  categoryError, 
  disabled 
}) {
  return (
    <div className="grid gap-8 py-4">
      <div className="grid gap-3">
        <Label htmlFor="categoria">Categoría *</Label>
        <Select
          disabled={disabled}
          value={formData.reporte.categoriaId}
          onValueChange={value => onChange('categoriaId', value)}
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

      <div className="grid gap-3">
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          disabled={disabled}
          value={formData.reporte.titulo}
          maxLength="50"
          onChange={e => onChange('titulo', e.target.value)}
          className={errors.titulo ? 'border-red-500' : ''}
          placeholder="Nombre del reporte"
        />
        <div className="flex justify-between">
          {errors.titulo && (
            <span className="text-red-500 text-sm">Máximo 50 caracteres</span>
          )}
          <span className={`text-sm ${charCount.titulo > 50 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount.titulo}/50
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="descripcion">Descripción *</Label>
        <div className="relative">
          <Textarea
            id="descripcion"
            disabled={disabled}
            value={formData.reporte.descripcion}
            maxLength="400"
            onChange={e => onChange('descripcion', e.target.value)}
            className={`resize-none h-64 pb-10 ${errors.descripcion ? 'border-red-500' : ''}`}
            placeholder="Descripción del reporte"
          />
          <div className="flex justify-between mt-2">
            {errors.descripcion && (
              <span className="text-red-500 text-sm">Máximo 400 caracteres</span>
            )}
            <span className={`text-sm ${charCount.descripcion > 400 ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount.descripcion}/400
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
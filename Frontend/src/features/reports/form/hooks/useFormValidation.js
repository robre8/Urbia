import { useState, useEffect, useMemo } from 'react';

export function useFormValidation(initialForm) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState({ titulo: 0, descripcion: 0 });

  const handleInputChange = (field, value, type = 'reporte') => {
    // Para categoriaId, asegurarse de que siempre sea un número
    if (field === 'categoriaId' && type === 'reporte') {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
      console.log(`Cambiando categoriaId a: ${numValue} (tipo: ${typeof numValue})`);
      
      setFormData(prev => ({
        ...prev,
        reporte: { ...prev.reporte, [field]: numValue }
      }));
      return;
    }
    
    if (type === 'reporte') {
      setFormData(prev => ({
        ...prev,
        reporte: { ...prev.reporte, [field]: value }
      }));
      if (field === 'titulo' || field === 'descripcion') {
        setCharCount(prev => ({ ...prev, [field]: value.length }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  useEffect(() => {
    const { categoriaId, titulo, descripcion } = formData.reporte;
    const newErrors = {
      categoriaId: !categoriaId,
      titulo: !titulo || titulo.length > 50,
      descripcion: !descripcion || descripcion.length > 400
    };
    setErrors(newErrors);
  }, [formData]);

  const isValid = useMemo(() => {
    return !Object.values(errors).some(e => e);
  }, [errors]);

  const resetForm = () => {
    setFormData(initialForm);
    setErrors({});
    setCharCount({ titulo: 0, descripcion: 0 });
  };

  return {
    formData,
    setFormData,
    errors,
    charCount,
    isValid,
    handleInputChange,
    resetForm
  };
}
import { create } from 'zustand';
import { getCategories } from '../api/categories/getCategories';

const useCategoryStore = create(set => ({
  categories: [],
  loading: false,
  error: null,
  toggles: {
    infraestructura: true,
    seguridad: true,
    salud: true,
    eventosSociales: true,
  },

  fetchCategories: async () => {
    console.log('🛠 Ejecutando fetchCategories en Zustand...');
    set({ loading: true, error: null });

    try {
      const categories = await getCategories();
      set({ categories, loading: false });
    } catch (error) {
      console.error('⚠️ Error en fetchCategories:', error);
      set({ error: error.message, loading: false });
    }
  },

  toggleCategory: (id) =>
    set((state) => ({
      toggles: { ...state.toggles, [id]: !state.toggles[id] },
    })),
}));

export default useCategoryStore;

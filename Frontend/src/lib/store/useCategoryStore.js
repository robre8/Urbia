import { create } from 'zustand';
import { getCategories } from '../api/categories/getCategories';

// Updated category mapping based on the observed behavior
// When user selects category with ID X, we need to send ID Y to the backend


const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  toggles: {
    infraestructura: true,
    seguridad: true,
    salud: true,
    eventosSociales: true,
  },
  lastFetchTime: 0,

  fetchCategories: async () => {
    // Check if we already have categories and if it's been less than 5 minutes since last fetch
    const { categories, lastFetchTime } = get();
    if (categories.length > 0 && Date.now() - lastFetchTime < 300000) {
      return; // Skip fetching if we already have data and it's recent
    }

    set({ loading: true, error: null });

    try {
      const categories = await getCategories();
      
      // Sort categories to ensure consistent order
      const sortedCategories = [...categories].sort((a, b) => a.id - b.id);
      
      set({ 
        categories: sortedCategories, 
        loading: false,
        lastFetchTime: Date.now() 
      });
    } catch (error) {
      console.error('⚠️ Error en fetchCategories:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Rest of the store remains the same
  toggleCategory: (id) =>
    set((state) => ({
      toggles: { ...state.toggles, [id]: !state.toggles[id] },
    }))
}));

export default useCategoryStore;

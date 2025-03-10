import { create } from 'zustand';
import { getCategories } from '../api/categories/getCategories';

// Updated category mapping based on the observed behavior
// When user selects category with ID X, we need to send ID Y to the backend
const categoryMapping = {
  // Format: frontendId: backendId
  1: 1,  // When user selects Salud (ID 1), send Salud (ID 1) to backend
  2: 2,  // When user selects Seguridad (ID 2), send Seguridad (ID 2) to backend
  3: 3,  // When user selects Infraestructura (ID 3), send Infraestructura (ID 3) to backend
  4: 4   // When user selects Eventos Sociales (ID 4), send Eventos Sociales (ID 4) to backend
};

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
    set({ loading: true, error: null });

    try {
      const categories = await getCategories();
      
      // Sort categories to ensure consistent order
      const sortedCategories = [...categories].sort((a, b) => a.id - b.id);
      

   
      
      set({ categories: sortedCategories, loading: false });
    } catch (error) {
      console.error('⚠️ Error en fetchCategories:', error);
      set({ error: error.message, loading: false });
    }
  },

  toggleCategory: (id) =>
    set((state) => ({
      toggles: { ...state.toggles, [id]: !state.toggles[id] },
    })),
    
  // Map category IDs correctly
  mapCategoryId: (displayedId) => {
    const numId = typeof displayedId === 'string' ? parseInt(displayedId, 10) : displayedId;
    return categoryMapping[numId] || numId; // Return mapped ID or original if no mapping exists
  }
}));

export default useCategoryStore;

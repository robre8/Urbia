import { create } from "zustand";
import { getCategories } from "../service/categories/getCategories";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    console.log("🛠 Ejecutando fetchCategories en Zustand...");
    set({ loading: true, error: null });

    try {
      const categories = await getCategories();
      set({ categories, loading: false });
    } catch (error) {
      console.error("⚠️ Error en fetchCategories:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useCategoryStore;

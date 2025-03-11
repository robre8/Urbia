import api from "../axios";

export const getCategories = async () => {
  try {
    const response = await api.get("/api/categorias");
    return response.data;
  } catch (error) {
    console.error("❌ Error en la API:", error);
    throw error;
  }
};

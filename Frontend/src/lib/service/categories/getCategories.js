import api from "../axios";

export const getCategories = async () => {
  try {
    console.log("🔄 Llamando a la API de categorías...");
    const response = await api.get("/api/categorias");
    return response.data;
  } catch (error) {
    console.error("❌ Error en la API:", error);
    throw error;
  }
};

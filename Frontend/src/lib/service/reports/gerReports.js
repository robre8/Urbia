import api from "../axios";

export const getReports = async () => {
  try {
    const response = await api.get("/api/reporte");

    return response.data;
  } catch (error) {
    console.error("❌ Error en la API:", error);
    throw error;
  }
};
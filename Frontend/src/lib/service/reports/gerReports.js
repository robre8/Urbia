import api from "../axios";

export const getReports = async () => {
  try {
    const response = await api.get("/api/reporte");
    console.log("✅ Datos recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en la API:", error);
    throw error;
  }
};
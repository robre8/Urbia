import api from "../axios";
import { normalizeReports } from "./normalizeReport";

export const getReports = async () => {
  try {
    const response = await api.get("/api/reporte");
    return normalizeReports(response.data);
  } catch (error) {
    console.error("❌ Error en la API:", error);
    throw error;
  }
};
import api from "../axios";
import { normalizeReports } from "./normalizeReport";

export async function getReportsByUserId(userId) {
  try {
    const { data } = await api.get(`/api/reporte/usuario/${userId}`);
    return normalizeReports(data);
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

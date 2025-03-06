import api from "../axios";

export async function getReportsByUserId(userId) {
  try {
    const { data } = await api.get(`/api/reporte/usuario/${userId}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
}

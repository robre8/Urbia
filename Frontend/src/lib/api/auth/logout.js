import api from "../axios";

export const logout = async () => {
  try {
    const response = await api.post("/api/auth/logout");
    console.log("✅ Sesión cerrada correctamente");
    return response.data;
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
    throw error;
  }
};
import api from "../axios";

export const login = async () => {
  try {
    const response = await api.post("/api/auth/login", {
      email: "elonmusk@tesla.com",
      password: "123Pa$word",
    });
    console.log("✅ Datos recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en la API:", error);
    throw error;
  }
};

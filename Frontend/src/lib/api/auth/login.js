import api from "../axios";

export const login = async (email, password) => {
  try {
    // Make sure we're sending the data in the format the API expects
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    
    // Store token if received
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    
    console.log("✅ Datos recibidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error en la API:", error);
    
    // Extract error message from response
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         "Error al iniciar sesión";
    
    throw new Error(errorMessage);
  }
};

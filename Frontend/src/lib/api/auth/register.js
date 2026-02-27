import api from "../axios";

export const register = async (nombre, email, password) => {
  try {
    // Make sure we're sending the data in the format the API expects
    const response = await api.post("/api/auth/register", {
      username: nombre,
      email,
      password,
    });
    
    // Store token if received
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }
    
    console.log("✅ Usuario registrado:", response.data);
    return response.data.user || response.data;
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    
    // Extract error message from response
    const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         "Error al registrar usuario";
    
    throw new Error(errorMessage);
  }
};
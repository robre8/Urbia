import api from "../axios";

const putReport = async (id, formData) => {
  // Use multipart/form-data for PUT requests just like POST
  const config = {
    headers: { 
      "Content-Type": "multipart/form-data",      
    },
    timeout: 30000  
  };

  try {
    // Send the formData directly to a combined endpoint
    const response = await api.put(`/api/reporte/${id}`, formData, config);   
    if (response.status === 200) {  // Changed from 201 to 200 to match Swagger docs
      return { message: "OK", data: response.data };
    } else {
      return { message: "ERROR", data: response };
    }
  } catch (error) {
    console.error("Error al enviar el reporte:", error);
    throw error;
  }
};

export default putReport;

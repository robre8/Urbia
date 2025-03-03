import api from "../axios";

const postReport = async (formData) => {
  const config = {
    headers: { 
      "Content-Type": "multipart/form-data",      
    },
    timeout: 30000  
  };

  try {
   const response = await api.post("/api/reporte/combinado", formData, config);   
    if (response.status == 201) {
      return { message: "OK", data: response.data };
    } else {
      return { message: "ERROR", data: response };
    }
  } catch (error) {
    console.error("Error al enviar el reporte:", error);
    throw error;
  }
};

export default postReport;

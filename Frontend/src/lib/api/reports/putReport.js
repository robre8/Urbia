import api from "../axios";

const putReport = async (formData) => {
  
  try {
   const response = await api.put(`/api/reporte/${formData.id}`, formData);   
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

export default putReport;

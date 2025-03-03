import api from "../axios";


const deleteReport = async (id) => {
    try {
        const response = await api.delete(`/api/reporte/${id}`);
        console.log(response);
        if (response.status == 200) {
            return { message: "OK" };
          } else {
            return { message: "ERROR", response: response };
          }
    } catch (error) {
        throw(error);
    }  
}

export default deleteReport
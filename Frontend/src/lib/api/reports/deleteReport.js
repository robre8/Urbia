import api from '../axios';

const deleteReport = async id => {
  const response = await api.delete(`/api/reporte/${id}`);
  console.log(response);
  if (response.status >= 200 && response.status < 300) {
    return { message: 'OK' };
  } else {
    return { message: 'ERROR', response };
  }
};

export default deleteReport;

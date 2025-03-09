import axios from "axios";

const api = axios.create({
  baseURL: "https://api-urbia.up.railway.app/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

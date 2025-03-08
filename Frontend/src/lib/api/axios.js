import axios from "axios";

const api = axios.create({
  baseURL: "https://handsome-wisdom-production.up.railway.app/",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

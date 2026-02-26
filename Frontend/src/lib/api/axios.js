import axios from "axios";

// API URL configuration for axios
// Development: http://localhost:8000
// Production (Vercel): Set VITE_API_URL in Vercel environment variables
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Check for existing token on initialization
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

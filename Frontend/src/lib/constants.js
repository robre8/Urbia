// API URL configuration using environment variables
// In development: Uses http://localhost:8000 (default)
// In production (Vercel): Set VITE_API_URL to https://urbia-production.up.railway.app
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
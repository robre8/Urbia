// API URL configuration using environment variables
// In development: Set VITE_API_URL in .env.local
// In production (Vercel): Set VITE_API_URL in project settings
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
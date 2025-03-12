import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginRequest } from "../api/auth/login";
import { register as registerRequest } from "../api/auth/register";
import { logout as logoutRequest } from "../api/auth/logout";
import api from "../api/axios";

export const useUserAuth = create(
  persist(
    (set) => ({
      user: null,
      loginWithGoogle: () => {
        // Redirect to Google OAuth endpoint
        window.location.href = "https://api-urbia.up.railway.app/oauth2/authorization/google";
      },
      handleOAuthCallback: async (token) => {
        try {
          // Set the token in localStorage and axios headers
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch user data with the token
          const response = await api.get('/api/auth/user');
          const userData = response.data;
          
          set({
            user: {
              id: userData.id,
              name: userData.nombre,
              email: userData.email,
              avatar: userData.avatar || null,
            },
          });
          
          return userData;
        } catch (error) {
          console.error("❌ Error processing OAuth callback:", error);
          throw error;
        }
      },
      login: async (email, password) => {
        try {
          const userData = await loginRequest(email, password);
          set({
            user: {
              id: userData.id,
              name: userData.nombre, // Se adapta a la clave 'nombre'
              email: userData.email,
              avatar: userData.avatar || null, // Si no hay avatar, se mantiene null
            },
          });
          return userData;
        } catch (error) {
          console.error("❌ Error al iniciar sesión:", error);
          throw error;
        }
      },
      register: async (nombre, email, password) => {
        try {
          const userData = await registerRequest(nombre, email, password);
          set({
            user: {
              id: userData.id,
              name: userData.nombre,
              email: userData.email,
              avatar: userData.avatar || null,
            },
          });
          return userData;
        } catch (error) {
          console.error("❌ Error al registrar usuario:", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await logoutRequest();
          set({ user: null });
        } catch (error) {
          console.error("❌ Error al cerrar sesión:", error);
          // Even if the API call fails, we still clear the local user data
          set({ user: null });
        }
      },
    }),
    {
      name: "user-auth", // Nombre de la key en localStorage
      getStorage: () => localStorage, // Usa localStorage
    }
  )
);

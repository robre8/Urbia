import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginRequest } from "../api/auth/login";

export const useUserAuth = create(
  persist(
    (set) => ({
      user: null,
      login: async () => {
        try {
          const userData = await loginRequest();
          set({
            user: {
              id: userData.id,
              name: userData.nombre, // Se adapta a la clave 'nombre'
              email: userData.email,
              avatar: userData.avatar || null, // Si no hay avatar, se mantiene null
            },
          });
        } catch (error) {
          console.error("❌ Error al iniciar sesión:", error);
        }
      },
      logout: () => set({ user: null }), // Borra los datos del usuario
    }),
    {
      name: "user-auth", // Nombre de la key en localStorage
      getStorage: () => localStorage, // Usa localStorage
    }
  )
);

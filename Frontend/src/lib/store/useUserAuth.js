import { create } from 'zustand';

export const useUserAuth = create((set) => ({
  user: null,
  login: () =>
    set({
      user: {
        name: 'Alejandro Pérez',
        avatar: '',
      },
    }),
  logout: () => set({ user: null }),
}));

import { create } from 'zustand';

export const useUserAuth = create((set) => ({
  user: null,
  login: () =>
    set({
      user: {
        name: 'Alejandro Pérez',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      },
    }),
  logout: () => set({ user: null }),
}));

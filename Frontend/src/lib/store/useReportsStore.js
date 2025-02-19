// lib/store/useReportsStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useReportsStore = create(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        reports: [],
        
        // Acción para setear los reports
        setReports: (newReports) => set({ reports: newReports }),

        // Acción para hacer fetch de los reports (ejemplo con mock o API real)
        fetchReports: async () => {
          try {
            // Aquí podrías hacer un fetch real:
            // const response = await fetch('/api/reports');
            // const data = await response.json();

            // O cargar desde un mock local (si lo tienes en /mocks)
            const data = await import('../../mocks/reports/reports.json');
            
            set({ reports: data.default }); // data.default por ser import dinámico
          } catch (error) {
            console.error('Error fetching reports:', error);
          }
        }
      }),
      {
        name: 'reports-storage', // Nombre para persistencia en localStorage
      }
    )
  )
);

export default useReportsStore;

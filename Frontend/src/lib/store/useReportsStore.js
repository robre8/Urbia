// lib/store/useReportsStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const STORAGE_VERSION = 2; // Incrementa este número si necesitas limpiar el storage en futuras actualizaciones

const useReportsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        reports: [],
        
        // Acción para setear los reports con validación
        setReports: (newReports) => {
          const validReports = newReports.filter(report => 
            typeof report.lat === 'number' &&
            typeof report.lng === 'number' &&
            !isNaN(report.lat) &&
            !isNaN(report.lng)
          );

          set({ reports: validReports });
        },

        // Acción para hacer fetch de los reports
        fetchReports: async () => {
          try {
            // Aquí podrías hacer un fetch real:
            // const response = await fetch('/api/reports');
            // const data = await response.json();

            // O cargar desde un mock local
            const data = await import('../../mocks/reports/reports.json');

            const validReports = data.default.filter(report => 
              typeof report.lat === 'number' &&
              typeof report.lng === 'number' &&
              !isNaN(report.lat) &&
              !isNaN(report.lng)
            );

            set({ reports: validReports });
          } catch (error) {
            console.error('Error fetching reports:', error);
          }
        },

        // Eliminar un reporte por ID
        deleteReport: (id) => {
          set((state) => ({
            reports: state.reports.filter((report) => report.id !== id),
          }));
        },

        // Acción para limpiar manualmente el almacenamiento local
        clearStorage: () => {
          localStorage.removeItem('reports-storage');
          set({ reports: [] });
          window.location.reload();
        }
      }),
      {
        name: 'reports-storage',
        version: STORAGE_VERSION, // Incrementar la versión limpia el almacenamiento local
        migrate: (persistedState, version) => {
          if (version < STORAGE_VERSION) {
            return { reports: [] }; // Si la versión es menor, limpiamos los datos antiguos
          }
          return persistedState;
        }
      }
    )
  )
);

export default useReportsStore;

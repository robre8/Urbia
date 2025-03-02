// lib/store/useReportsStore.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { getReports } from '../api/reports/getReports';
import postReport from '../api/reports/postReport';

const STORAGE_VERSION = 2;

const useReportsStore = create(
  devtools(
    persist(
      (set, get) => ({
        reports: [],
        reportPreview: {}, //Reporte que obtengo apenas hago un POST reporte/combinado, tiene la descripcion de IA... se usa para mostrar el preview del reporte 
        loading: false,
        error: null,

        fetchReports: async () => {
          set({ loading: true, error: null });
          try {
            const data = await getReports();

            console.log('✅ Reports:', data);
            set({ reports: data, loading: false });
          } catch (err) {
            set({ error: err.message, loading: false });
          }
        },

        clearStorage: () => {
          localStorage.removeItem('reports-storage');
          set({ reports: [], reportPreview: {} });
          window.location.reload();
        },        

        sendReport: async (data) => {
          set({loading: true, error: null});
          try {
            const response = await postReport(data);
            //console.log('reportPreview', response.data);
            set({reportPreview: response.data, loading: false})
          } catch (error) {
              set({ error: err.message, loading: false });
          }
        }
      }),
      {
        name: 'reports-storage',
        version: STORAGE_VERSION,
        migrate: (persisted, version) => {
          if (version < STORAGE_VERSION)
            return { reports: [], reportPreview: {}, loading: false, error: null };
          return persisted;
        },
        partialize: state => ({
          reports: state.reports,
          reportPreview: state.reportPreview,
          loading: state.loading,
          error: state.error
        })
      }
    )
  )
);

export default useReportsStore;

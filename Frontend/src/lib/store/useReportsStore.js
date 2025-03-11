// lib/store/useReportsStore.js
// Add proper initialization for lastFetchTime
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getReports } from "../api/reports/getReports";
import postReport from "../api/reports/postReport";
import putReport from "../api/reports/putReport";
import deleteReport from "../api/reports/deleteReport";
import { getReportsByUserId } from "../api/reports/getReportsById";
import { groupReports } from "../utils/groupReports";

const STORAGE_VERSION = 3;
const CACHE_DURATION = 300000;

const useReportsStore = create(
  devtools(
    persist(
      (set, get) => ({
        reports: [],
        groupedReports: {},
        reportsByUserId: [],
        reportPreview: {},
        loading: false,
        error: null,
        // Initialize lastFetchTime with proper structure
        lastFetchTime: {
          allReports: 0,
          userReports: 0
        },

        fetchReports: async () => {
          // Check if we need to fetch or if cache is still valid
          const now = Date.now();
          const lastFetch = get().lastFetchTime?.allReports || 0;
          
          // Only fetch if no reports or cache expired
          if (get().reports.length === 0 || now - lastFetch > CACHE_DURATION) {
            set({ loading: true, error: null });
            try {
              const data = await getReports();
              const reportsArray = Array.isArray(data) ? data : [];
              set({
                reports: reportsArray,
                groupedReports: groupReports(reportsArray),
                loading: false,
                lastFetchTime: {
                  ...get().lastFetchTime,
                  allReports: now
                }
              });
            } catch (err) {
              console.error("Error fetching reports:", err);
              set({
                error: err.message,
                loading: false,
                reports: [],
                groupedReports: {}
              });
            }
          }
        },

        // Add the new method here, inside the store object
        updateReportsDirectly: (updatedReports) => {
          set({
            reports: updatedReports,
            groupedReports: groupReports(updatedReports),
            loading: false
          });
        },

        fetchReportsByUserId: async (userId) => {
          set({ loading: true, error: null });
          try {
            const data = await getReportsByUserId(userId);
            set({ reportsByUserId: data, loading: false });
          } catch (err) {
            set({ error: err.message, loading: false });
          }
        },

        clearStorage: () => {
          set({
            reports: [],
            reportsByUserId: [],
            groupedReports: {},
            reportPreview: null, // Make sure to clear the preview
            loading: false,
            error: null
          });
        },

        clearReportPreview: () => {
          set({ reportPreview: {} });
        },

        sendReport: async (data) => {
          set({ loading: true, error: null });
          try {
            // Verificar que data sea una instancia de FormData
            if (!(data instanceof FormData)) {
              throw new Error("Los datos deben ser una instancia de FormData");
            }
            
            // Verificar que el reporte esté incluido
            if (!data.get('reporte')) {
              throw new Error("El reporte es requerido");
            }
            
            const response = await postReport(data);
            
            if (response && response.data) {
              const newReports = [...get().reports, response.data];
              set({
                reportPreview: response.data,
                reports: newReports,
                groupedReports: groupReports(newReports),
                loading: false
              });
              return response.data;
            } else {
              throw new Error("Respuesta inválida del servidor");
            }
          } catch (error) {
            console.error("Error en sendReport:", error);
            set({ 
              error: error.message || "Error al enviar el reporte", 
              loading: false 
            });
            throw error; // Re-lanzar para manejo en el componente
          }
        },

        editReport: async (id, data) => {
          set({ loading: true, error: null });
          try {
            // Verificar que data sea una instancia de FormData
            if (!(data instanceof FormData)) {
              throw new Error("Los datos deben ser una instancia de FormData");
            }
            
            const response = await putReport(id, data);
            
            if (response.message !== "OK" || !response.data) {
              throw new Error("Error al actualizar el reporte");
            }
            
            // Update the reports list with the updated report
            const updatedReports = get().reports.map((report) =>
              report.id === id ? response.data : report
            );
            
            set({
              reportPreview: response.data,
              reports: updatedReports,
              groupedReports: groupReports(updatedReports),
              loading: false
            });
            
            return response.data;
          } catch (error) {
            console.error("Error en editReport:", error);
            set({ 
              error: error.message || "Error al actualizar el reporte", 
              loading: false 
            });
            throw error; // Re-lanzar para manejo en el componente
          }
        },

        deleteReport: async (id) => {
          set({ loading: true, error: null });
          try {
            const { message } = await deleteReport(id);
            if (message === "OK") {
              const filteredReports = get().reports.filter((r) => r.id !== id);
              set({
                reports: filteredReports,
                reportsByUserId: get().reportsByUserId.filter(
                  (r) => r.id !== id
                ),
                groupedReports: groupReports(filteredReports),
                loading: false
              });
            } else {
              set({
                loading: false,
                error: "No se pudo eliminar el reporte."
              });
            }
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        }
      }),
      {
        name: "reports-storage",
        getStorage: () => localStorage,
        version: STORAGE_VERSION,
        migrate: (persistedState, version) => {
          if (version < STORAGE_VERSION) {
            // Reset state on version change
            return {
              reports: [],
              groupedReports: {},
              reportsByUserId: [],
              reportPreview: {},
              loading: false,
              error: null,
              lastFetchTime: {
                allReports: 0,
                userReports: 0
              }
            };
          }
          return persistedState;
        }
      }
    )
  )
);

export default useReportsStore;

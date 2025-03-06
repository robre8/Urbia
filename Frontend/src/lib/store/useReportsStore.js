// lib/store/useReportsStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getReports } from "../api/reports/getReports";
import postReport from "../api/reports/postReport";
import putReport from "../api/reports/putReport";
import deleteReport from "../api/reports/deleteReport";
import { getReportsByUserId } from "../api/reports/getReportsById";
import { groupReports } from "../utils/groupReports";

const STORAGE_VERSION = 3;

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

        fetchReports: async () => {
          set({ loading: true, error: null });
          try {
            const data = await getReports();
            const reportsArray = Array.isArray(data) ? data : [];
            set({
              reports: reportsArray,
              groupedReports: groupReports(reportsArray),
              loading: false
            });
          } catch (err) {
            set({
              error: err.message,
              loading: false,
              reports: [],
              groupedReports: {}
            });
          }
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
          localStorage.removeItem("reports-storage");
          set({ reports: [], reportsByUserId: [], groupedReports: {} });
          window.location.reload();
        },

        clearReportPreview: () => {
          set({ reportPreview: {} });
        },

        sendReport: async (data) => {
          set({ loading: true, error: null });
          try {
            const response = await postReport(data);
            const newReports = [...get().reports, response.data];
            set({
              reportPreview: response.data,
              reports: newReports,
              groupedReports: groupReports(newReports),
              loading: false
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },

        editReport: async (data) => {
          set({ loading: true, error: null });
          try {
            const response = await putReport(data);
            const updatedReports = get().reports.map((report) =>
              report.id === data.id ? response.data : report
            );
            set({
              reportPreview: response.data,
              reports: updatedReports,
              groupedReports: groupReports(updatedReports),
              loading: false
            });
          } catch (error) {
            set({ error: error.message, loading: false });
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
        version: STORAGE_VERSION,
        migrate: (persisted, version) => {
          if (version < STORAGE_VERSION) {
            return {
              reports: [],
              groupedReports: {},
              reportsByUserId: [],
              reportPreview: {},
              loading: false,
              error: null
            };
          }
          return persisted;
        },
        partialize: (state) => ({
          reports: state.reports,
          groupedReports: state.groupedReports,
          reportsByUserId: state.reportsByUserId,
          reportPreview: state.reportPreview,
          loading: state.loading,
          error: state.error
        })
      }
    )
  )
);

export default useReportsStore;

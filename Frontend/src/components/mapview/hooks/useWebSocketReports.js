import { useEffect, useRef } from 'react';
import useReportsStore from '@/lib/store/useReportsStore';

export function useWebSocketReports() {
  const reportsStore = useReportsStore();
  const pollingIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Function to fetch reports safely
    const fetchReportsSafely = async () => {
      if (isMountedRef.current) {
        try {
          await reportsStore.fetchReports();
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      }
    };
    
    // Initial fetch with delay
    const initialFetchTimeout = setTimeout(() => {
      fetchReportsSafely();
    }, 2000);
    
    // Set up polling with a reasonable interval
    pollingIntervalRef.current = setInterval(() => {
      fetchReportsSafely();
    }, 30000); // Poll every 30 seconds to reduce load
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      clearTimeout(initialFetchTimeout);
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once on mount

  // Don't return anything that could cause re-renders
  return {};
}
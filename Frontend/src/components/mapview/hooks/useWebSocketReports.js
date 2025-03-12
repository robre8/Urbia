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
          // Force refresh by bypassing cache
          await reportsStore.fetchReports(true);
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      }
    };
    
    // Initial fetch immediately
    fetchReportsSafely();
    
    // Set up polling with a much shorter interval for more responsive updates
    pollingIntervalRef.current = setInterval(() => {
      fetchReportsSafely();
    }, 3000); // Poll every 3 seconds for more real-time updates
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once on mount

  return {};
}
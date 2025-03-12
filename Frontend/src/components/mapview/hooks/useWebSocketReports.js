import { useEffect, useRef } from 'react';
import useReportsStore from '@/lib/store/useReportsStore';

export function useWebSocketReports() {
  const { fetchReports } = useReportsStore();
  const pollingIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastFetchTimeRef = useRef(0);
  
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    // Function to fetch reports safely
    const fetchReportsSafely = async () => {
      if (isMountedRef.current) {
        try {
          // Add timestamp to avoid caching issues in production
          const timestamp = Date.now();
          if (timestamp - lastFetchTimeRef.current > 1000) { // Prevent too frequent requests
            await fetchReports(true);
            lastFetchTimeRef.current = timestamp;
            console.log('Reports fetched at:', new Date().toISOString());
          }
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      }
    };
    
    // Initial fetch immediately
    fetchReportsSafely();
    
    // Set up polling with a more reliable approach
    pollingIntervalRef.current = setInterval(() => {
      fetchReportsSafely();
    }, 5000);
    
    // Add event listener for visibility changes to refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchReportsSafely();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array to run only once

  return {};
}
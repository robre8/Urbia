import { useEffect, useRef, useState, useCallback } from 'react';
import useReportsStore from '@/lib/store/useReportsStore';

// Global state to prevent multiple instances from fetching simultaneously
let globalIsFetching = false;
let lastGlobalFetchTime = 0;
const MIN_FETCH_INTERVAL = 10000; // 10 seconds between fetches

export function useWebSocketReports() {
  const { fetchReports } = useReportsStore();
  const pollingIntervalRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isPaused, setIsPaused] = useState(false);
  
  // Use useCallback to memoize these functions
  const pausePolling = useCallback(() => {
    setIsPaused(true);
    console.log('WebSocket polling paused');
  }, []);
  
  const resumePolling = useCallback(() => {
    setIsPaused(false);
    console.log('WebSocket polling resumed');
  }, []);
  
  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchReportsSafely = useCallback(async (force = false) => {
    // Skip if paused
    if (isPaused && !force) {
      return;
    }
    
    // Skip if another instance is already fetching
    if (globalIsFetching) {
      return;
    }
    
    // Enforce minimum time between fetches
    const now = Date.now();
    if (!force && now - lastGlobalFetchTime < MIN_FETCH_INTERVAL) {
      return;
    }
    
    // Skip if component unmounted
    if (!isMountedRef.current) {
      return;
    }
    
    try {
      globalIsFetching = true;
      await fetchReports(true);
      lastGlobalFetchTime = Date.now();
      
      // Only log in development to reduce console noise
      // Using import.meta.env instead of process.env for Vite
      if (import.meta.env.DEV) {
        console.log('Reports fetched at:', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      globalIsFetching = false;
    }
  }, [fetchReports, isPaused]);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    // Initial fetch only if not paused and no recent fetch
    if (!isPaused && Date.now() - lastGlobalFetchTime > MIN_FETCH_INTERVAL) {
      fetchReportsSafely();
    }
    
    // Set up polling with a much longer interval (15 seconds)
    pollingIntervalRef.current = setInterval(() => {
      fetchReportsSafely();
    }, 15000);
    
    // Visibility change handler with debounce
    let visibilityTimeout = null;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPaused) {
        // Clear any existing timeout
        if (visibilityTimeout) {
          clearTimeout(visibilityTimeout);
        }
        
        // Set a new timeout to debounce the fetch
        visibilityTimeout = setTimeout(() => {
          fetchReportsSafely();
        }, 1000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
      }
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchReportsSafely, isPaused]);

  return { pausePolling, resumePolling };
}
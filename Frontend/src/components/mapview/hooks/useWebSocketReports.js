import { useEffect, useRef } from 'react';
// Import the net module from stompjs instead of sockjs-client
import { Client } from '@stomp/stompjs';
import useReportsStore from '@/lib/store/useReportsStore';
import { toast } from 'sonner';
import api from '@/lib/api/axios';

export function useWebSocketReports() {
  const stompClient = useRef(null);
  const { fetchReports } = useReportsStore();
  
  useEffect(() => {
    // Create WebSocket connection
    const connect = () => {
      try {
        // Use standard WebSocket instead of SockJS
        stompClient.current = new Client({
          brokerURL: `${api.defaults.baseURL.replace('http', 'ws')}/ws`,
          debug: function (str) {
            console.log('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        stompClient.current.onConnect = () => {
          console.log('Connected to WebSocket');
          
          // Subscribe to the topic where new reports are published
          stompClient.current.subscribe('/topic/reportes', (message) => {
            console.log('Received WebSocket message:', message.body);
            
            // Show notification
            toast.info('¡Nuevo reporte creado!', {
              description: 'Se ha creado un nuevo reporte en el mapa.',
              duration: 5000,
            });
            
            // Refresh reports data
            fetchReports();
          });
        };

        stompClient.current.onStompError = (frame) => {
          console.error('STOMP error:', frame);
        };

        stompClient.current.activate();
      } catch (err) {
        console.error('Error establishing WebSocket connection:', err);
      }
    };

    connect();

    // Cleanup function
    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
        console.log('WebSocket connection closed');
      }
    };
  }, [fetchReports]);

  return { stompClient: stompClient.current };
}
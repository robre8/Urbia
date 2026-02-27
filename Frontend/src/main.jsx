import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Workbox } from 'workbox-window';

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');

  wb.addEventListener('installed', (event) => {
    if (event.isUpdate) {
      console.log('Nueva versión disponible. Recarga para actualizar.');
    }
  });

  wb.addEventListener('waiting', () => {
    wb.messageSkipWaiting();
  });

  wb.register();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

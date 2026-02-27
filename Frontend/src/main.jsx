import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Workbox } from 'workbox-window';

// Registrar el Service Worker
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  wb.register();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

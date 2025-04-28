
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import './styles/buttons.css';
import './styles/animations.css';
import './styles/borders.css';
import { fetchInitialServices } from './utils/pricing/serviceInitializer';
import { HelmetProvider } from 'react-helmet-async';
import './utils/email/manualEmailRecovery'; // Import for initialization
import './utils/email/emailRecovery'; // Import for initialization

// Initialize default services if needed
fetchInitialServices()
  .catch(err => console.error('Error initializing services:', err));

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

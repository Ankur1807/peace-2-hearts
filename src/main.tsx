
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { fetchInitialServices } from './utils/pricing/serviceInitializer';

// Initialize default services if needed
fetchInitialServices()
  .catch(err => console.error('Error initializing services:', err));

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(<App />);

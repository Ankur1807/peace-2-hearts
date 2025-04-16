import React from 'react';

// Google Analytics is now implemented directly in the HTML head
// This component remains as a placeholder for potential future analytics enhancements
const GoogleAnalytics = () => {
  return null;
};

// Keep the global type declaration for consistency
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default GoogleAnalytics;

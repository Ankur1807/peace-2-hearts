
import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
  useEffect(() => {
    // Add Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-BJD6KFHSGF";
    document.head.appendChild(script1);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-BJD6KFHSGF');

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
    };
  }, []);

  return null;
};

// Add gtag to window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default GoogleAnalytics;

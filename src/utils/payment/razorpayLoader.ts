
/**
 * Utilities for loading the Razorpay script
 */

/**
 * Loads Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      // If Razorpay is already loaded, resolve immediately
      if (window.Razorpay) {
        console.log("Razorpay already loaded in window object");
        resolve(true);
        return;
      }
      
      // If script tag is already present, wait for it to load
      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        console.log("Razorpay script tag already exists, waiting for load");
        existingScript.addEventListener('load', () => {
          console.log("Existing Razorpay script loaded");
          resolve(true);
        });
        existingScript.addEventListener('error', () => {
          console.error("Failed to load existing Razorpay script");
          resolve(false);
        });
        return;
      }
      
      // Create and load script dynamically
      console.log("Dynamically loading Razorpay script");
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded dynamically");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script dynamically");
        resolve(false);
      };
      document.body.appendChild(script);
    } else {
      resolve(false);
    }
  });
};

// Check if Razorpay is available in window
export const isRazorpayAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Razorpay;
};

// Make sure we have the global Razorpay type defined
declare global {
  interface Window {
    Razorpay: any;
  }
}

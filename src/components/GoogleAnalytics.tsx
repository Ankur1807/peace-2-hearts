
import Script from './Script';

// Extend Window interface to include dataLayer property
declare global {
  interface Window {
    dataLayer: any[];
  }
}

const GoogleAnalytics = () => {
  return (
    <>
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-BJD6KFHSGF" 
        async={true} 
      />
      <Script
        id="google-analytics"
        src="" // Empty string for inline script
        async={false}
        onLoad={() => {
          window.dataLayer = window.dataLayer || [];
          function gtag(...args: any[]) {
            window.dataLayer.push(args);
          }
          gtag('js', new Date());
          gtag('config', 'G-BJD6KFHSGF');
        }}
      />
    </>
  );
};

export default GoogleAnalytics;

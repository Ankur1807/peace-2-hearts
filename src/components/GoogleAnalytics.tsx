
import Script from './Script';

const GoogleAnalytics = () => {
  return (
    <>
      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-BJD6KFHSGF" 
        async={true} 
      />
      <Script
        id="google-analytics"
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

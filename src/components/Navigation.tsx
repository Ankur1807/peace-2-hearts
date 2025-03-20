
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './navigation/Logo';
import DesktopMenu from './navigation/DesktopMenu';
import WaveyHeader from './navigation/WaveyHeader';
import MobileHeader from './navigation/MobileHeader';
import { checkAuthentication } from '@/utils/authUtils';

const Navigation = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const authStatus = await checkAuthentication();
      setIsLoggedIn(authStatus);
    };
    
    checkAuth();
  }, [location.pathname]);

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Calculate opacity based on scroll position
  const getHeaderOpacity = () => {
    const scrollThreshold = 200;
    const initialOpacity = 0.8;
    const opacityChange = (Math.min(scrollPosition, scrollThreshold) / scrollThreshold) * (1 - initialOpacity);
    return initialOpacity + opacityChange;
  };

  // The key difference: render different markup based on device type
  if (isMobile) {
    return (
      <MobileHeader isLoggedIn={isLoggedIn} userName="" onSignOut={() => {}} />
    );
  }

  // Desktop header
  return (
    <nav 
      className="shadow-sm py-4 sticky top-0 w-full relative overflow-hidden transition-colors duration-300 z-[50]"
      style={{
        backgroundColor: `rgba(139, 92, 246, ${getHeaderOpacity()})`,
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Wavey lines background for header */}
      <WaveyHeader />

      <div className="container mx-auto flex justify-between items-center relative z-[60]">
        <Logo />
        
        <DesktopMenu isLoggedIn={isLoggedIn} userName="" onSignOut={() => {}} />
      </div>
    </nav>
  );
};

export default Navigation;

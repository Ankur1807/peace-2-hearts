
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './navigation/Logo';
import DesktopMenu from './navigation/DesktopMenu';
import WaveyHeader from './navigation/WaveyHeader';
import MobileHeader from './navigation/MobileHeader';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserName(user.name);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // Add scroll event listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to top when route changes, but only if not triggered by logo click
  useEffect(() => {
    // We need to scroll to top when navigating to a new page
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Calculate opacity based on scroll position (0 to 200px scroll range)
  const getHeaderOpacity = () => {
    // Start with partial transparency and become fully opaque by 200px scroll
    const scrollThreshold = 200;
    const initialOpacity = 0.8; // Initial opacity at top (80%)
    const opacityChange = (Math.min(scrollPosition, scrollThreshold) / scrollThreshold) * (1 - initialOpacity);
    return initialOpacity + opacityChange;
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate('/sign-in');
  };

  // Use completely different header for mobile
  if (isMobile) {
    return (
      <MobileHeader
        isLoggedIn={isLoggedIn}
        userName={userName}
        onSignOut={handleSignOut}
      />
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
        
        <DesktopMenu 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          onSignOut={handleSignOut} 
        />
      </div>
    </nav>
  );
};

export default Navigation;

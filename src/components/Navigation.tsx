
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './navigation/Logo';
import DesktopMenu from './navigation/DesktopMenu';
import MobileMenu from './navigation/MobileMenu';
import WaveyHeader from './navigation/WaveyHeader';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserName(user.name);
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

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle clicks outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Calculate opacity based on scroll position (0 to 200px scroll range)
  const getHeaderOpacity = () => {
    // Start with partial transparency and become fully opaque by 200px scroll
    const scrollThreshold = 200;
    const initialOpacity = 0.8; // Initial opacity at top (80%)
    const opacityChange = (Math.min(scrollPosition, scrollThreshold) / scrollThreshold) * (1 - initialOpacity);
    return initialOpacity + opacityChange;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate('/sign-in');
  };

  return (
    <nav 
      ref={navRef}
      className="shadow-sm py-4 sticky top-0 z-40 w-full relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: `rgba(139, 92, 246, ${getHeaderOpacity()})`, // vibrantPurple with dynamic opacity
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Wavey lines background for header */}
      <WaveyHeader />

      <div className="container mx-auto flex justify-between items-center relative z-40">
        <Logo />
        
        {!isMobile && (
          <DesktopMenu 
            isLoggedIn={isLoggedIn} 
            userName={userName} 
            onSignOut={handleSignOut} 
          />
        )}
        
        {isMobile && (
          <button 
            ref={menuButtonRef}
            className="text-white relative z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isLoggedIn={isLoggedIn}
        userName={userName}
        isMenuOpen={isMenuOpen}
        onSignOut={handleSignOut}
        onMenuToggle={toggleMenu}
      />
    </nav>
  );
};

export default Navigation;

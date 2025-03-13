
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
    
    // Close menu when route changes
    const closeMenu = () => {
      setIsMenuOpen(false);
    };
    
    window.addEventListener('popstate', closeMenu);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', closeMenu);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node) &&
        navRef.current &&
        navRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPosition}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isMenuOpen, scrollPosition]);

  // Calculate opacity based on scroll position (0 to 200px scroll range)
  const getHeaderOpacity = () => {
    // Start with partial transparency and become fully opaque by 200px scroll
    const scrollThreshold = 200;
    const initialOpacity = 0.8; // Initial opacity at top (80%)
    const opacityChange = (Math.min(scrollPosition, scrollThreshold) / scrollThreshold) * (1 - initialOpacity);
    return initialOpacity + opacityChange;
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        
        <DesktopMenu 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          onSignOut={handleSignOut} 
        />
        
        <button 
          ref={menuButtonRef}
          className="md:hidden text-white relative z-50"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          style={{ touchAction: 'manipulation' }}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isLoggedIn={isLoggedIn}
        userName={userName}
        isMenuOpen={isMenuOpen}
        onSignOut={handleSignOut}
        onMenuToggle={() => setIsMenuOpen(false)}
      />
    </nav>
  );
};

export default Navigation;

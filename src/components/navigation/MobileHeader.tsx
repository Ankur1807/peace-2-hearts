
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MobileHeaderBar from './mobile/MobileHeaderBar';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';
import MobileMenuContent from './mobile/MobileMenuContent';

interface MobileHeaderProps {
  isLoggedIn: boolean;
  userName: string;
  onSignOut: () => void;
}

const MobileHeader = ({ isLoggedIn, userName, onSignOut }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    // Scroll to top with a smooth animation when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-md">
        <MobileHeaderBar 
          toggleMenu={toggleMenu} 
          isMenuOpen={isMenuOpen} 
        />
      </header>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        <MobileMenuOverlay 
          isVisible={isMenuOpen} 
          onClick={toggleMenu} 
        />
      </AnimatePresence>
      
      {/* Mobile navigation menu */}
      <MobileMenuContent 
        isOpen={isMenuOpen}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onSignOut={onSignOut}
        onMenuItemClick={handleMenuItemClick}
      />
    </>
  );
};

export default MobileHeader;

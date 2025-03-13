
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MobileMenuContent from './mobile/MobileMenuContent';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';
import MobileHeaderBar from './mobile/MobileHeaderBar';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Fixed header bar */}
      <MobileHeaderBar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {/* Add a spacer to push content below the fixed header */}
      <div className="h-16"></div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <MobileMenuOverlay 
          isVisible={isMenuOpen} 
          onClick={toggleMenu} 
        />
      )}
      
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

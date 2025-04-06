
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MobileMenuContent from './mobile/MobileMenuContent';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';
import MobileHeaderBar from './mobile/MobileHeaderBar';

interface MobileHeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
}

const MobileHeader = ({ isLoggedIn, userName, onSignOut }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
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
    <div className="mobile-header fixed top-0 left-0 w-full z-50">
      <MobileHeaderBar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {isMenuOpen && (
        <MobileMenuOverlay 
          isVisible={isMenuOpen} 
          onClick={toggleMenu} 
        />
      )}
      
      <MobileMenuContent 
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        onMenuItemClick={handleMenuItemClick}
      />
      
      {/* Adjust this spacer to prevent content from being hidden under the header */}
      <div className="h-16 transition-all duration-300"></div>
    </div>
  );
};

export default MobileHeader;

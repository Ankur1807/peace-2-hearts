
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MobileMenuContent from './mobile/MobileMenuContent';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';
import MobileHeaderBar from './mobile/MobileHeaderBar';
import NewsTicker from './NewsTicker';

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
      
      <div className="px-4 py-2 bg-vibrantPurple/90">
        <NewsTicker />
      </div>
      
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
      
      <div className="h-24"></div> {/* Increased height to accommodate ticker */}
    </div>
  );
};

export default MobileHeader;

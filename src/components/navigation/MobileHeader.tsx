
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
  const [showTicker, setShowTicker] = useState(true);
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

  // Add scroll listener to hide ticker on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowTicker(false);
      } else {
        setShowTicker(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
      
      {showTicker && (
        <div className="px-4 py-2 bg-vibrantPurple/90 transition-all duration-300">
          <NewsTicker />
        </div>
      )}
      
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
      <div className={`${showTicker ? 'h-28' : 'h-16'} transition-all duration-300`}></div>
    </div>
  );
};

export default MobileHeader;

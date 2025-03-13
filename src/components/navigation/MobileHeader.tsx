
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MobileMenuContent from './mobile/MobileMenuContent';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';

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
      {/* Super simplified header with high contrast */}
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-vibrantPurple shadow-lg z-50">
        {/* Logo with high contrast */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-lora text-xl font-bold text-white">Peace2Hearts</span>
        </Link>
        
        {/* High contrast menu button */}
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-vibrantPurple" />
          ) : (
            <Menu className="h-6 w-6 text-vibrantPurple" />
          )}
        </button>
      </div>
      
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

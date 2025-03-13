
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MobileMenuContent from './mobile/MobileMenuContent';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <header className="sticky top-0 z-50 w-full shadow-md">
        <div className="w-full h-16 flex items-center justify-between px-4 bg-vibrantPurple">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
              <circle cx="60" cy="60" r="56" fill="url(#circleGradient)" stroke="#FFFFFF" strokeWidth="4" />
              
              <path d="M60 15 L60 105" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <path d="M60 60 L25 95" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <path d="M60 60 L95 95" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              
              <path d="M42 35 A12 12 0 0 1 60 28 A12 12 0 0 1 78 35 A12 12 0 0 1 78 53 Q78 65 60 78 Q42 65 42 53 A12 12 0 0 1 42 35Z" fill="url(#heartGradient)" />
              
              <circle cx="35" cy="30" r="3" fill="#F9A8D4" />
              <circle cx="85" cy="30" r="3" fill="#93C5FD" />
              <circle cx="45" cy="75" r="3" fill="#FDE68A" />
              <circle cx="75" cy="75" r="3" fill="#86EFAC" />
              
              <defs>
                <linearGradient id="circleGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C4B5FD" />
                  <stop offset="100%" stopColor="#E0E7FF" />
                </linearGradient>
                <linearGradient id="heartGradient" x1="42" y1="28" x2="78" y2="78" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F9A8D4" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-lora text-xl font-bold text-white drop-shadow-md">Peace2Hearts</span>
          </Link>
          
          {/* Menu button */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-vibrantPurple" />
            ) : (
              <Menu className="h-6 w-6 text-vibrantPurple" />
            )}
          </button>
        </div>
      </header>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenuOverlay 
            isVisible={isMenuOpen} 
            onClick={toggleMenu} 
          />
        )}
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

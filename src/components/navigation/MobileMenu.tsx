
import { useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userName: string;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onMenuToggle: () => void;
}

const MobileMenu = ({ isLoggedIn, userName, isMenuOpen, onSignOut, onMenuToggle }: MobileMenuProps) => {
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling of the body when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <div 
      ref={mobileMenuRef}
      className={`fixed inset-0 bg-vibrantPurple/95 backdrop-blur-md shadow-md transition-all duration-300 ease-in-out z-50 ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      style={{ 
        top: '72px',
        height: 'calc(100vh - 72px)'
      }}
    >
      <div className="container mx-auto py-4 flex flex-col gap-4">
        <Link to="/" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Home</Link>
        <Link to="/about" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>About Us</Link>
        <Link to="/services" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Services</Link>
        <Link to="/resources" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Resources</Link>
        <Link to="/contact" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Contact</Link>
        
        <UserMenu 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          onSignOut={onSignOut} 
          isMobile={true} 
          onItemClick={onMenuToggle}
        />
        
        <Link to="/book-consultation" onClick={onMenuToggle}>
          <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full mt-2">
            Book Consultation
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;

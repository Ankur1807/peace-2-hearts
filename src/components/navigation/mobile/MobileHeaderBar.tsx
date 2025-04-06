
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4 bg-vibrantPurple shadow-md" style={{ position: 'relative', zIndex: 100 }}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/6a7e5248-cc34-4298-b6e9-3cfe585ec7d1.png" 
          alt="Peace2Hearts Logo" 
          className="h-8"
        />
        <span className="font-lora text-lg font-semibold text-white">Peace2Hearts</span>
      </Link>
      
      {/* Menu button with clear visibility */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md"
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-vibrantPurple" />
        ) : (
          <Menu className="h-6 w-6 text-vibrantPurple" />
        )}
      </button>
    </div>
  );
};

export default MobileHeaderBar;

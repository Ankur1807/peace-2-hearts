
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-vibrantPurple shadow-md z-50">
      {/* Logo with high contrast */}
      <Link to="/" className="flex items-center">
        <span className="font-lora text-xl font-bold text-white" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}>
          Peace2Hearts
        </span>
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

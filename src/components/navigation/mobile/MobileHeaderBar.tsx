
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CircuitHeartLogo from '../CircuitHeartLogo';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4 bg-vibrantPurple shadow-md transition-all duration-300" style={{ position: 'relative', zIndex: 100 }}>
      {/* Logo */}
      <CircuitHeartLogo size="sm" />
      
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

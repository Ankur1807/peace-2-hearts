
import { Menu, X } from 'lucide-react';
import Logo from '../Logo';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      {/* Logo container with solid translucent background for maximum visibility */}
      <div className="py-2 px-4 rounded-md bg-white/20 backdrop-blur-sm shadow-md">
        <Logo />
      </div>
      
      {/* Menu button with improved visibility */}
      <button
        className="text-white p-3 bg-white/20 backdrop-blur-sm rounded-md shadow-md hover:bg-white/30 focus:outline-none transition-colors"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <Menu className="h-7 w-7 text-white" />
        )}
      </button>
    </div>
  );
};

export default MobileHeaderBar;

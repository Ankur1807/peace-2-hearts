
import Logo from '../Logo';
import { Menu, X } from 'lucide-react';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      {/* Logo container with strong visibility */}
      <div className="py-2 px-3 rounded-md bg-white/80 backdrop-blur-sm shadow-lg">
        <Logo />
      </div>
      
      {/* Menu button with improved visibility */}
      <button
        className="text-white p-2 bg-vibrantPurple/90 rounded-md shadow-md hover:bg-vibrantPurple focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default MobileHeaderBar;


import { Menu, X } from 'lucide-react';
import Logo from '../Logo';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      {/* Logo container with solid white background for maximum visibility */}
      <div className="py-2 px-4 rounded-md bg-white shadow-xl">
        <Logo />
      </div>
      
      {/* Menu button with solid background and larger touch target */}
      <button
        className="text-white p-3 bg-white rounded-md shadow-xl hover:bg-white/90 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-7 w-7 text-vibrantPurple" />
        ) : (
          <Menu className="h-7 w-7 text-vibrantPurple" />
        )}
      </button>
    </div>
  );
};

export default MobileHeaderBar;

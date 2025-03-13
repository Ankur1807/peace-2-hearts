
import { Menu, X } from 'lucide-react';
import Logo from '../Logo';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      {/* Logo container with solid background for maximum visibility */}
      <div className="py-2 px-4 rounded-md bg-white shadow-md">
        <Logo />
      </div>
      
      {/* Menu button with solid background for maximum visibility */}
      <button
        className="text-vibrantPurple p-3 bg-white rounded-md shadow-md hover:bg-gray-100 focus:outline-none transition-colors"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <Menu className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

export default MobileHeaderBar;

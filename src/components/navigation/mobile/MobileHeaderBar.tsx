
import { Menu, X } from 'lucide-react';
import Logo from '../Logo';
import { cn } from '@/lib/utils';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4 bg-vibrantPurple relative z-10">
      {/* Logo */}
      <div className="flex items-center">
        <Logo />
      </div>
      
      {/* Menu button */}
      <button
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md",
          "hover:bg-gray-100 transition-colors focus:outline-none"
        )}
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
  );
};

export default MobileHeaderBar;

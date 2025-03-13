
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="w-full h-16 flex items-center justify-between px-4 bg-vibrantPurple">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <span className="font-lora text-xl font-bold text-white">Peace2Hearts</span>
      </Link>
      
      {/* Menu button */}
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md"
        onClick={toggleMenu}
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


import Logo from '../Logo';

interface MobileHeaderBarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const MobileHeaderBar = ({ toggleMenu, isMenuOpen }: MobileHeaderBarProps) => {
  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      {/* Enhanced logo container with stronger contrast background */}
      <div className="py-2 px-3 rounded-md bg-white/50 backdrop-blur-sm shadow-lg">
        <Logo />
      </div>
      
      {/* Menu button */}
      <button
        className="text-white p-1 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        )}
      </button>
    </div>
  );
};

export default MobileHeaderBar;

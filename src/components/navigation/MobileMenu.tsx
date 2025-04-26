
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userName: string;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onMenuToggle: () => void;
}

const MobileMenu = ({ isLoggedIn, userName, isMenuOpen, onSignOut, onMenuToggle }: MobileMenuProps) => {
  const handleItemClick = () => {
    onMenuToggle();
  };

  return (
    <div 
      className={`fixed inset-0 top-[72px] z-[200] ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* Custom overlay */}
      <div 
        className={`fixed inset-0 top-[72px] bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 z-[200] ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onMenuToggle}
      />
      
      {/* Custom drawer that slides from top */}
      <div
        className={`bg-vibrantPurple shadow-xl border-none rounded-b-xl transition-transform duration-300 ease-in-out z-[201] relative ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          maxHeight: 'calc(100vh - 72px)',
        }}
      >
        <ScrollArea className="h-full max-h-[calc(100vh-72px)]">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            <Link to="/" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={handleItemClick}>Home</Link>
            <Link to="/about" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={handleItemClick}>About Us</Link>
            <Link to="/services" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={handleItemClick}>Services</Link>
            <Link to="/resources" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={handleItemClick}>Resources</Link>
            <Link to="/contact" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={handleItemClick}>Contact</Link>
            
            <UserMenu isMobile={true} onItemClick={handleItemClick} />
            
            <Link to="/book-consultation" onClick={handleItemClick}>
              <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full mt-2 w-full">
                Book Consultation
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MobileMenu;

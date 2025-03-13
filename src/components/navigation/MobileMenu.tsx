
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
  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[100] ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={{ marginTop: '72px' }}
    >
      {/* Custom overlay */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 z-[90] ${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onMenuToggle}
      />
      
      {/* Custom drawer that slides from top */}
      <div
        className={`bg-vibrantPurple/90 backdrop-blur-md border-none rounded-b-xl transition-transform duration-300 ease-in-out z-[100] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          maxHeight: '70vh',
          position: 'relative',
        }}
      >
        <ScrollArea className="h-full max-h-[calc(70vh-16px)]">
          <div className="container mx-auto py-4 flex flex-col gap-4">
            <Link to="/" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Home</Link>
            <Link to="/about" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>About Us</Link>
            <Link to="/services" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Services</Link>
            <Link to="/resources" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Resources</Link>
            <Link to="/contact" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuToggle}>Contact</Link>
            
            <UserMenu 
              isLoggedIn={isLoggedIn} 
              userName={userName} 
              onSignOut={onSignOut} 
              isMobile={true} 
              onItemClick={onMenuToggle}
            />
            
            <Link to="/book-consultation" onClick={onMenuToggle}>
              <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full mt-2">
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

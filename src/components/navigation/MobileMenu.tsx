
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";
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
    <Drawer open={isMenuOpen} onOpenChange={onMenuToggle}>
      <DrawerPortal>
        <DrawerOverlay className="bg-black/10 backdrop-blur-[2px]" />
        <DrawerContent 
          className="max-h-[70vh] bg-vibrantPurple/50 backdrop-blur-md border-none rounded-b-xl"
          // Override the default drawer styling to position from top
          style={{
            top: '72px',
            bottom: 'auto',
            height: 'auto',
            maxHeight: '70vh',
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out'
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
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export default MobileMenu;

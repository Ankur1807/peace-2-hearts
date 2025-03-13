
import { useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuProps {
  isLoggedIn: boolean;
  userName: string;
  isMenuOpen: boolean;
  onSignOut: () => void;
  onMenuToggle: () => void;
}

const MobileMenu = ({ isLoggedIn, userName, isMenuOpen, onSignOut, onMenuToggle }: MobileMenuProps) => {
  // Use SheetContent from shadcn/ui for better mobile handling
  return (
    <Sheet open={isMenuOpen} onOpenChange={onMenuToggle}>
      <SheetContent 
        side="right" 
        className="p-0 border-none bg-vibrantPurple/95 backdrop-blur-md w-full sm:max-w-full"
        style={{ 
          top: '72px',
          height: 'calc(100vh - 72px)'
        }}
      >
        <ScrollArea className="h-full w-full">
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

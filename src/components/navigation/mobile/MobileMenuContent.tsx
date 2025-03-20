
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuContentProps {
  isOpen: boolean;
  onMenuItemClick: () => void;
}

const MobileMenuContent = ({ isOpen, onMenuItemClick }: MobileMenuContentProps) => {
  return (
    <div
      className={`bg-vibrantPurple shadow-xl border-none rounded-b-xl transition-transform duration-300 ease-in-out z-[201] fixed inset-0 top-[64px] ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        maxHeight: 'calc(100vh - 64px)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <ScrollArea className="h-full max-h-[calc(100vh-64px)]">
        <div className="container mx-auto py-4 flex flex-col gap-4">
          <Link to="/" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuItemClick}>Home</Link>
          <Link to="/about" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuItemClick}>About Us</Link>
          <Link to="/services" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuItemClick}>Services</Link>
          <Link to="/resources" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuItemClick}>Resources</Link>
          <Link to="/contact" className="text-white hover:text-white/80 transition-colors py-2 block" onClick={onMenuItemClick}>Contact</Link>
          
          <Link to="/book-consultation" className="text-white hover:text-white/80 transition-colors py-2" onClick={onMenuItemClick}>
            Book Consultation
          </Link>
          
          <Link to="/book-consultation" onClick={onMenuItemClick}>
            <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full mt-2">
              Book Consultation
            </Button>
          </Link>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MobileMenuContent;

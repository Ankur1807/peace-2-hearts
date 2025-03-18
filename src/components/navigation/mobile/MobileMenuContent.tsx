
import { Link } from "react-router-dom";
import { UserMenu } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileMenuContentProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userName: string;
  onSignOut: () => void;
  onMenuItemClick?: () => void;
}

const MobileMenuContent = ({
  isOpen,
  isLoggedIn,
  userName,
  onSignOut,
  onMenuItemClick,
}: MobileMenuContentProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 bg-purple-600 overflow-hidden transition-all duration-300",
        isOpen ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container px-4 py-8 flex flex-col">
          <div className="flex flex-col space-y-5">
            <Link to="/" className="text-white text-lg" onClick={onMenuItemClick}>
              Home
            </Link>
            <Link to="/about" className="text-white text-lg" onClick={onMenuItemClick}>
              About Us
            </Link>
            <Link to="/services" className="text-white text-lg" onClick={onMenuItemClick}>
              Services
            </Link>
            <Link to="/resources" className="text-white text-lg" onClick={onMenuItemClick}>
              Resources
            </Link>
            <Link to="/contact" className="text-white text-lg" onClick={onMenuItemClick}>
              Contact
            </Link>
            
            <div className="pt-4">
              <UserMenu
                isLoggedIn={isLoggedIn}
                userName={userName}
                onSignOut={onSignOut}
                isMobile={true}
                onItemClick={onMenuItemClick}
              />
            </div>
            
            <div className="pt-4">
              <Link to="/book-consultation" onClick={onMenuItemClick}>
                <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default MobileMenuContent;

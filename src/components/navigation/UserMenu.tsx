
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  isLoggedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const UserMenu = ({ isMobile = false, onItemClick }: UserMenuProps) => {
  if (isMobile) {
    return (
      <>
        <Link to="/book-consultation" className="text-white hover:text-white/80 transition-colors py-2" onClick={onItemClick}>
          Book Consultation
        </Link>
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/book-consultation">
        <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full px-6">
          Book Consultation
        </Button>
      </Link>
    </div>
  );
};

export default UserMenu;

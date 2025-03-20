
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { checkIsAdmin } from "@/utils/authUtils";

interface UserMenuProps {
  isLoggedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const UserMenu = ({ isMobile = false, onItemClick, isLoggedIn }: UserMenuProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isLoggedIn) {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      }
    };
    
    checkAdminStatus();
  }, [isLoggedIn]);
  
  if (isMobile) {
    return (
      <>
        <Link to="/book-consultation" className="text-white hover:text-white/80 transition-colors py-2" onClick={onItemClick}>
          Book Consultation
        </Link>
        {isAdmin && (
          <Link to="/consultant-management" className="text-white hover:text-white/80 transition-colors py-2" onClick={onItemClick}>
            Manage Consultants
          </Link>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {isAdmin && (
        <Link to="/consultant-management">
          <Button variant="outline" className="text-white border-white hover:bg-white/10">
            Manage Consultants
          </Button>
        </Link>
      )}
      <Link to="/book-consultation">
        <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full px-6">
          Book Consultation
        </Button>
      </Link>
    </div>
  );
};

export default UserMenu;

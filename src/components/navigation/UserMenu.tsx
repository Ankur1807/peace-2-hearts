
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

interface UserMenuProps {
  isLoggedIn: boolean;
  userName: string;
  onSignOut: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const UserMenu = ({ isLoggedIn, userName, onSignOut, isMobile = false, onItemClick }: UserMenuProps) => {
  if (isMobile) {
    return isLoggedIn ? (
      <>
        <div className="flex items-center gap-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <span className="text-sm font-medium text-white">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <span className="font-medium text-white">{userName}</span>
        </div>
        <Link to="/dashboard" className="text-white hover:text-white/80 transition-colors py-2" onClick={onItemClick}>
          Dashboard
        </Link>
        <Button 
          variant="outline" 
          className="mt-2 border-white text-white hover:bg-white/20" 
          onClick={() => { 
            onSignOut(); 
            if (onItemClick) onItemClick(); 
          }}
        >
          Sign Out
        </Button>
      </>
    ) : (
      <>
        <Link to="/sign-in" className="text-white hover:text-white/80 transition-colors py-2" onClick={onItemClick}>
          Sign In
        </Link>
        <Link to="/sign-up" className="text-white hover:text-white/80 transition-colors py-2" onClick={onItemClick}>
          Sign Up
        </Link>
      </>
    );
  }

  return isLoggedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-white/20">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600">
            <span className="text-sm font-medium text-white">{userName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{userName}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/book-consultation">Book Consultation</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-4">
      <Link to="/sign-in" className="text-white hover:text-white/80 transition-colors">Sign In</Link>
      <Link to="/book-consultation">
        <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full px-6">
          Book Consultation
        </Button>
      </Link>
    </div>
  );
};

export default UserMenu;

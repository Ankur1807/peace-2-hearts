
import { Link } from "react-router-dom";

interface DesktopMenuProps {
  isLoggedIn?: boolean;
  userName?: string;
  onSignOut?: () => void;
}

const DesktopMenu = ({ isLoggedIn, userName, onSignOut }: DesktopMenuProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-white hover:text-white/80 transition-colors">
        Home
      </Link>
      <Link to="/about" className="text-white hover:text-white/80 transition-colors">
        About
      </Link>
      <Link to="/services" className="text-white hover:text-white/80 transition-colors">
        Services
      </Link>
      <Link to="/consultants" className="text-white hover:text-white/80 transition-colors">
        Consultants
      </Link>
      <Link to="/resources" className="text-white hover:text-white/80 transition-colors">
        Resources
      </Link>
      <Link to="/contact" className="text-white hover:text-white/80 transition-colors">
        Contact
      </Link>
    </div>
  );
};

export default DesktopMenu;

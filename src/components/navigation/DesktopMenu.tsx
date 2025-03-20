
import { Link } from "react-router-dom";

const DesktopMenu = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-primary hover:text-peacefulBlue transition-colors">
        Home
      </Link>
      <Link to="/about" className="text-primary hover:text-peacefulBlue transition-colors">
        About
      </Link>
      <Link to="/services" className="text-primary hover:text-peacefulBlue transition-colors">
        Services
      </Link>
      <Link to="/consultants" className="text-primary hover:text-peacefulBlue transition-colors">
        Consultants
      </Link>
      <Link to="/resources" className="text-primary hover:text-peacefulBlue transition-colors">
        Resources
      </Link>
      <Link to="/contact" className="text-primary hover:text-peacefulBlue transition-colors">
        Contact
      </Link>
    </div>
  );
};

export default DesktopMenu;

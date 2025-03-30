
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2" onClick={(e) => {
      // Prevent default if we're already on the homepage to avoid double navigation
      if (window.location.pathname === '/') {
        e.preventDefault();
        
        // Scroll to top with a smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }}>
      <img 
        src="/lovable-uploads/aa1e4069-d5ee-4dda-9699-74f185ae43bf.png" 
        alt="Peace2Hearts Logo" 
        className="h-10 md:h-12"
      />
    </Link>
  );
};

export default Logo;

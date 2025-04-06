
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3" onClick={(e) => {
      // Prevent default if we're already on the homepage to avoid double navigation
      if (window.location.pathname === '/') {
        e.preventDefault();
        
        // Scroll to top with a smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }}>
      <img 
        src="/lovable-uploads/6a7e5248-cc34-4298-b6e9-3cfe585ec7d1.png" 
        alt="Peace2Hearts Logo" 
        className="h-10 md:h-12"
      />
      <span className="font-lora text-lg md:text-xl font-semibold text-white">Peace2Hearts</span>
    </Link>
  );
};

export default Logo;

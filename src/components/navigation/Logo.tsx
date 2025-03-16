
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
      <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        {/* Circular background with gradient */}
        <circle cx="60" cy="60" r="56" fill="url(#circleGradient)" stroke="#FFFFFF" strokeWidth="4" />
        
        {/* Stylized "P" */}
        <path d="M35 40 L35 80" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <path d="M35 40 C35 40 55 40 60 40 C70 40 75 47 75 55 C75 63 70 70 60 70 C55 70 35 70 35 70" 
              stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        
        {/* Stylized "2" with gradient fill */}
        <path d="M50 50 C50 50 55 45 60 45 C65 45 70 50 70 55 C70 70 45 75 45 85 C45 87 47 87 50 87 L70 87" 
              stroke="#FFFFFF" strokeWidth="0" fill="url(#heartGradient)" />
        
        {/* Stylized "H" */}
        <path d="M85 40 L85 80" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <path d="M85 60 L65 60" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <path d="M65 40 L65 80" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        
        {/* Small decorative elements */}
        <circle cx="35" cy="30" r="3" fill="#F9A8D4" />
        <circle cx="85" cy="30" r="3" fill="#93C5FD" />
        <circle cx="45" cy="85" r="3" fill="#FDE68A" />
        <circle cx="75" cy="85" r="3" fill="#86EFAC" />
        
        {/* Gradients definition */}
        <defs>
          <linearGradient id="circleGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          <linearGradient id="heartGradient" x1="45" y1="45" x2="70" y2="87" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-lora text-xl font-bold text-white drop-shadow-md">Peace2Hearts</span>
    </Link>
  );
};

export default Logo;

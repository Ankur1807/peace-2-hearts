
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
        
        {/* Hand outline in white */}
        <path d="M35 70 C35 50 45 40 60 40 C75 40 85 55 85 70 L75 95 C70 100 50 100 45 95 L35 70 Z" 
              stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Thumb of the hand */}
        <path d="M35 70 C30 65 30 55 35 50" 
              stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Heart in the hand with gradient */}
        <path d="M50 60 A10 10 0 0 1 60 50 A10 10 0 0 1 70 60 A10 10 0 0 1 70 75 Q70 85 60 90 Q50 85 50 75 A10 10 0 0 1 50 60Z" 
              fill="url(#heartGradient)" />
        
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
          <linearGradient id="heartGradient" x1="50" y1="50" x2="70" y2="90" gradientUnits="userSpaceOnUse">
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


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
        
        {/* Connected P2H letters */}
        <g transform="translate(25, 35)">
          {/* P Letter */}
          <path d="M0 0 L0 50" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M0 0 C0 0 20 0 25 0 C35 0 40 7 40 15 C40 23 35 30 25 30 C20 30 0 30 0 30" 
                stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          
          {/* 2 with gradient fill - connected to P */}
          <path d="M32 15 C40 15 45 20 45 25 C45 35 30 40 20 45 C20 45 20 50 25 50 L45 50" 
                stroke="none" fill="url(#heartGradient)" />
          
          {/* H Letter - connected to 2 */}
          <path d="M50 0 L50 50" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M50 25 L70 25" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <path d="M70 0 L70 50" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
        </g>
        
        {/* Small decorative elements */}
        <circle cx="30" cy="25" r="3" fill="#F9A8D4" />
        <circle cx="90" cy="25" r="3" fill="#93C5FD" />
        <circle cx="35" cy="95" r="3" fill="#FDE68A" />
        <circle cx="85" cy="95" r="3" fill="#86EFAC" />
        
        {/* Gradients definition */}
        <defs>
          <linearGradient id="circleGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          <linearGradient id="heartGradient" x1="20" y1="15" x2="45" y2="50" gradientUnits="userSpaceOnUse">
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

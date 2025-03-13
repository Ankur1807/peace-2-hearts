
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        <circle cx="60" cy="60" r="56" fill="url(#circleGradient)" stroke="#FFFFFF" strokeWidth="4" />
        
        <path d="M60 15 L60 105" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <path d="M60 60 L25 95" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <path d="M60 60 L95 95" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        
        <path d="M42 35 A12 12 0 0 1 60 28 A12 12 0 0 1 78 35 A12 12 0 0 1 78 53 Q78 65 60 78 Q42 65 42 53 A12 12 0 0 1 42 35Z" fill="url(#heartGradient)" />
        
        <circle cx="35" cy="30" r="3" fill="#F9A8D4" />
        <circle cx="85" cy="30" r="3" fill="#93C5FD" />
        <circle cx="45" cy="75" r="3" fill="#FDE68A" />
        <circle cx="75" cy="75" r="3" fill="#86EFAC" />
        
        <defs>
          <linearGradient id="circleGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="100%" stopColor="#E0E7FF" />
          </linearGradient>
          <linearGradient id="heartGradient" x1="42" y1="28" x2="78" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9A8D4" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-lora text-2xl font-semibold text-white">Peace2Hearts</span>
    </Link>
  );
};

export default Logo;


import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserName(user.name);
    }

    // Add scroll event listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Close menu when route changes
    const closeMenu = () => {
      setIsMenuOpen(false);
    };
    
    window.addEventListener('popstate', closeMenu);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', closeMenu);
    };
  }, []);

  // Calculate opacity based on scroll position (0 to 200px scroll range)
  const getHeaderOpacity = () => {
    // Start with partial transparency and become fully opaque by 200px scroll
    const scrollThreshold = 200;
    const initialOpacity = 0.8; // Initial opacity at top (80%)
    const opacityChange = (Math.min(scrollPosition, scrollThreshold) / scrollThreshold) * (1 - initialOpacity);
    return initialOpacity + opacityChange;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate('/sign-in');
  };

  return (
    <nav 
      className="shadow-sm py-4 sticky top-0 z-50 w-full relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: `rgba(139, 92, 246, ${getHeaderOpacity()})`, // vibrantPurple with dynamic opacity
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Wavey lines background for header */}
      <svg className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 80C240 100 480 40 720 40C960 40 1200 100 1440 90V120H0V80Z" fill="url(#header-wave1)" fillOpacity="0.3"/>
        <path d="M0 50C240 30 480 80 720 70C960 60 1200 30 1440 40V120H0V50Z" fill="url(#header-wave2)" fillOpacity="0.2"/>
        <defs>
          <linearGradient id="header-wave1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6"/>
            <stop offset="1" stopColor="#0EA5E9"/>
          </linearGradient>
          <linearGradient id="header-wave2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316"/>
            <stop offset="1" stopColor="#D946EF"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="container mx-auto flex justify-between items-center relative z-10">
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
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-white hover:text-white/80 transition-colors">Home</Link>
          <Link to="/about" className="text-white hover:text-white/80 transition-colors">About Us</Link>
          <Link to="/services" className="text-white hover:text-white/80 transition-colors">Services</Link>
          <Link to="/resources" className="text-white hover:text-white/80 transition-colors">Resources</Link>
          <Link to="/contact" className="text-white hover:text-white/80 transition-colors">Contact</Link>
          
          {isLoggedIn ? (
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
                <DropdownMenuItem onClick={handleSignOut}>
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
          )}
        </div>
        
        <button 
          className="md:hidden text-white z-20"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden fixed left-0 right-0 top-[72px] bg-vibrantPurple/95 backdrop-blur-md shadow-md z-50 transition-all duration-300 ${isMenuOpen ? 'h-auto opacity-100 visible' : 'h-0 opacity-0 invisible'}`} style={{ overflowY: isMenuOpen ? 'auto' : 'hidden' }}>
        <div className="container mx-auto py-4 flex flex-col gap-4">
          <Link to="/" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Home</Link>
          <Link to="/about" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>About Us</Link>
          <Link to="/services" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Services</Link>
          <Link to="/resources" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Resources</Link>
          <Link to="/contact" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Contact</Link>
          
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm font-medium text-white">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <span className="font-medium text-white">{userName}</span>
              </div>
              <Link to="/dashboard" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Dashboard</Link>
              <Button variant="outline" className="mt-2 border-white text-white hover:bg-white/20" onClick={() => { handleSignOut(); toggleMenu(); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Sign In</Link>
              <Link to="/sign-up" className="text-white hover:text-white/80 transition-colors py-2" onClick={toggleMenu}>Sign Up</Link>
            </>
          )}
          
          <Link to="/book-consultation" onClick={toggleMenu}>
            <Button className="bg-white hover:bg-white/90 text-purple-600 rounded-full mt-2">
              Book Consultation
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

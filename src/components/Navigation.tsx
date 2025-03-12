
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, Menu, User, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserName(user.name);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate('/sign-in');
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-peacefulBlue" />
          <span className="font-lora text-2xl font-semibold text-gray-800">Peace2Hearts</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-peacefulBlue transition-colors">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-peacefulBlue transition-colors">About Us</Link>
          <Link to="/services" className="text-gray-700 hover:text-peacefulBlue transition-colors">Services</Link>
          <Link to="/resources" className="text-gray-700 hover:text-peacefulBlue transition-colors">Resources</Link>
          <Link to="/contact" className="text-gray-700 hover:text-peacefulBlue transition-colors">Contact</Link>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-peacefulBlue text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peacefulBlue">
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
              <Link to="/sign-in" className="text-gray-700 hover:text-peacefulBlue transition-colors">Sign In</Link>
              <Link to="/book-consultation">
                <Button className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white rounded-full px-6">
                  Book Consultation
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-40 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>About Us</Link>
            <Link to="/services" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Services</Link>
            <Link to="/resources" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Resources</Link>
            <Link to="/contact" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Contact</Link>
            
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-peacefulBlue">
                    <span className="text-sm font-medium text-white">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-medium">{userName}</span>
                </div>
                <Link to="/dashboard" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Dashboard</Link>
                <Button variant="outline" className="mt-2" onClick={() => { handleSignOut(); toggleMenu(); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Sign In</Link>
                <Link to="/sign-up" className="text-gray-700 hover:text-peacefulBlue transition-colors py-2" onClick={toggleMenu}>Sign Up</Link>
              </>
            )}
            
            <Link to="/book-consultation" onClick={toggleMenu}>
              <Button className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white rounded-full mt-2">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

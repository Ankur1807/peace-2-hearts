
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
          <Link to="/book-consultation">
            <Button className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white rounded-full px-6">
              Book Consultation
            </Button>
          </Link>
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

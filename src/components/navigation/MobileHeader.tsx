
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, Briefcase, BookText, Phone, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';
import UserMenu from './UserMenu';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileHeaderProps {
  isLoggedIn: boolean;
  userName: string;
  onSignOut: () => void;
}

const MobileHeader = ({ isLoggedIn, userName, onSignOut }: MobileHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  const menuVariants = {
    closed: { 
      y: "-100%",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: { 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <>
      <header className="bg-vibrantPurple sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          
          <button
            className="text-white p-1 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Decorative wave at bottom of header */}
        <svg 
          className="w-full h-6 absolute bottom-0 translate-y-full" 
          viewBox="0 0 1440 60" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0 20C240 35 480 5 720 15C960 25 1200 40 1440 30V60H0V20Z" 
            fill="#8B5CF6" 
            fillOpacity="0.8"
          />
          <path 
            d="M0 10C240 0 480 25 720 20C960 15 1200 0 1440 5V60H0V10Z" 
            fill="#8B5CF6" 
            fillOpacity="0.4"
          />
        </svg>
      </header>
      
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile navigation menu */}
      <motion.nav
        className="fixed top-16 left-0 right-0 bottom-0 bg-gradient-to-b from-vibrantPurple to-purple-700 z-50 overflow-auto"
        variants={menuVariants}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        style={{
          pointerEvents: isMenuOpen ? "auto" : "none",
          maxHeight: "calc(100vh - 4rem)"
        }}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Link 
                to="/" 
                className="flex items-center gap-3 text-white text-lg py-2"
                onClick={handleMenuItemClick}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link 
                to="/about" 
                className="flex items-center gap-3 text-white text-lg py-2"
                onClick={handleMenuItemClick}
              >
                <Info className="h-5 w-5" />
                About Us
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link 
                to="/services" 
                className="flex items-center gap-3 text-white text-lg py-2"
                onClick={handleMenuItemClick}
              >
                <Briefcase className="h-5 w-5" />
                Services
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link 
                to="/resources" 
                className="flex items-center gap-3 text-white text-lg py-2"
                onClick={handleMenuItemClick}
              >
                <BookText className="h-5 w-5" />
                Resources
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Link 
                to="/contact" 
                className="flex items-center gap-3 text-white text-lg py-2"
                onClick={handleMenuItemClick}
              >
                <Phone className="h-5 w-5" />
                Contact
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="pt-4 border-t border-white/20"
          >
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white font-medium">{userName.charAt(0)}</span>
                  </div>
                  <span className="text-white text-lg">{userName}</span>
                </div>
                
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-3 text-white text-lg py-2"
                  onClick={handleMenuItemClick}
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>
                
                <Button 
                  variant="outline" 
                  className="mt-2 w-full border-white text-white hover:bg-white/10" 
                  onClick={() => { 
                    onSignOut(); 
                    handleMenuItemClick(); 
                  }}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  to="/sign-in" 
                  className="block text-white text-lg py-2"
                  onClick={handleMenuItemClick}
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  className="block text-white text-lg py-2"
                  onClick={handleMenuItemClick}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-2">
            <Link to="/book-consultation" onClick={handleMenuItemClick}>
              <Button className="w-full bg-white hover:bg-white/90 text-purple-600 rounded-full py-5">
                Book Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
};

export default MobileHeader;

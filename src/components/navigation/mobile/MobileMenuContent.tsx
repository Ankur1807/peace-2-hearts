
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Info, Briefcase, BookText, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MobileMenuContentProps {
  isOpen: boolean;
  onMenuItemClick: () => void;
}

const MobileMenuContent = ({ 
  isOpen, 
  onMenuItemClick 
}: MobileMenuContentProps) => {
  
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
    <motion.nav
      className="fixed top-16 left-0 right-0 bottom-0 bg-gradient-to-b from-vibrantPurple to-purple-700 z-50 overflow-auto"
      variants={menuVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      style={{
        pointerEvents: isOpen ? "auto" : "none",
        maxHeight: "calc(100vh - 4rem)"
      }}
    >
      <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Link 
              to="/" 
              className="flex items-center gap-3 text-white text-lg py-2"
              onClick={onMenuItemClick}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/about" 
              className="flex items-center gap-3 text-white text-lg py-2"
              onClick={onMenuItemClick}
            >
              <Info className="h-5 w-5" />
              About Us
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/services" 
              className="flex items-center gap-3 text-white text-lg py-2"
              onClick={onMenuItemClick}
            >
              <Briefcase className="h-5 w-5" />
              Services
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/resources" 
              className="flex items-center gap-3 text-white text-lg py-2"
              onClick={onMenuItemClick}
            >
              <BookText className="h-5 w-5" />
              Resources
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/contact" 
              className="flex items-center gap-3 text-white text-lg py-2"
              onClick={onMenuItemClick}
            >
              <Phone className="h-5 w-5" />
              Contact
            </Link>
          </motion.div>
        </div>
        
        <motion.div variants={itemVariants} className="mt-2">
          <Link to="/book-consultation" onClick={onMenuItemClick}>
            <Button className="w-full bg-white hover:bg-white/90 text-purple-600 rounded-full py-5">
              Book Consultation
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default MobileMenuContent;

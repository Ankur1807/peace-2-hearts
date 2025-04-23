
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MandalaButton } from "@/components/MandalaButton";

interface MobileMenuContentProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuItemClick?: () => void;
  isLoggedIn?: boolean;
}

const MobileMenuContent = ({ isOpen, onClose, onMenuItemClick, isLoggedIn }: MobileMenuContentProps) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  if (isLoggedIn) {
    links.push({ path: "/dashboard", label: "Dashboard" });
  }

  const menuVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "100%", opacity: 0 },
  };

  const linkVariants = {
    open: { y: 0, opacity: 1 },
    closed: { y: 20, opacity: 0 },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const handleLinkClick = () => {
    if (onMenuItemClick) onMenuItemClick();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <div className="absolute inset-0 bg-vibrantPurple">
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10 transition-colors text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <motion.nav
          className="mt-6 px-6"
          variants={containerVariants}
        >
          <ul className="space-y-6">
            {links.map((link) => (
              <motion.li key={link.path} variants={linkVariants}>
                <Link
                  to={link.path}
                  className="text-xl font-medium block py-2 text-white hover:text-white/80 transition-colors"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
        <div className="px-6 mt-10 flex justify-center">
          <MandalaButton 
            variant="secondary" 
            mandalaType="lotus"
            href="/book-consultation"
            onClick={handleLinkClick}
            className="w-full text-lg"
          >
            Book Your Session
          </MandalaButton>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenuContent;

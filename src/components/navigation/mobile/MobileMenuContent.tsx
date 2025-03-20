
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface MobileMenuContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuContent = ({ isOpen, onClose }: MobileMenuContentProps) => {
  const links = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/consultants", label: "Consultants" },
    { path: "/resources", label: "Resources" },
    { path: "/contact", label: "Contact" },
  ];

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

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
    >
      <div className="absolute inset-0 bg-white">
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xl font-bold">Menu</span>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
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
                  className="text-xl font-medium block py-2"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </motion.div>
  );
};

export default MobileMenuContent;

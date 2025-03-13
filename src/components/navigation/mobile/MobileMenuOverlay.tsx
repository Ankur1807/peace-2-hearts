
import { motion } from 'framer-motion';

interface MobileMenuOverlayProps {
  isVisible: boolean;
  onClick: () => void;
}

const MobileMenuOverlay = ({ isVisible, onClick }: MobileMenuOverlayProps) => {
  return (
    isVisible && (
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClick}
      />
    )
  );
};

export default MobileMenuOverlay;

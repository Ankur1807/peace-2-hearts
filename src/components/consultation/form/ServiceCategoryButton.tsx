
import React from 'react';
import { Heart, Scale, Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ServiceCategoryButtonProps {
  category: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
  index: number; // For staggered animation
}

const ServiceCategoryButton: React.FC<ServiceCategoryButtonProps> = ({
  category,
  title,
  isSelected,
  onClick,
  index
}) => {
  const getIcon = () => {
    switch (category) {
      case 'mental-health':
        return <Heart className="w-8 h-8" />;
      case 'legal':
        return <Scale className="w-8 h-8" />;
      case 'holistic':
        return <Star className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getCategoryGradient = () => {
    switch (category) {
      case 'mental-health':
        return "from-peacefulBlue to-lightBlue";
      case 'legal':
        return "from-softGreen to-paleYellow";
      case 'holistic':
        return "from-vibrantPurple to-softPink";
      default:
        return "from-gray-200 to-gray-100";
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.2, // Staggered entrance
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <button
        onClick={handleClick}
        className={cn(
          "w-full py-8 px-6 rounded-2xl transition-all duration-300 ease-in-out flex flex-col items-center gap-4",
          "border-2 shadow-lg",
          isSelected ? 
            `bg-gradient-to-br ${getCategoryGradient()} text-white border-transparent` : 
            "bg-white border-gray-100 text-gray-700 hover:border-gray-200"
        )}
      >
        <div className={cn(
          "p-4 rounded-full transition-colors duration-300",
          isSelected ? "bg-white/20" : "bg-gray-50"
        )}>
          {getIcon()}
        </div>
        <span className="font-medium text-lg">{title}</span>
      </button>
    </motion.div>
  );
};

export default ServiceCategoryButton;

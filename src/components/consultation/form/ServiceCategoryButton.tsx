
import React from 'react';
import { Heart, Scale, Star } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ServiceCategoryButtonProps {
  category: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

const ServiceCategoryButton: React.FC<ServiceCategoryButtonProps> = ({
  category,
  title,
  isSelected,
  onClick
}) => {
  const getIcon = () => {
    switch (category) {
      case 'mental-health':
        return <Heart className="w-6 h-6" />;
      case 'legal':
        return <Scale className="w-6 h-6" />;
      case 'holistic':
        return <Star className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent default behavior which might cause scrolling
    e.preventDefault();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full p-4 rounded-xl transition-all duration-300 ease-in-out flex flex-col items-center gap-2",
        "border-2 hover:border-peacefulBlue",
        isSelected ? 
          "bg-gradient-to-r from-peacefulBlue to-softGreen text-white border-transparent transform scale-[1.02] shadow-lg" : 
          "bg-white border-gray-200 text-gray-700 hover:shadow-md"
      )}
    >
      <div className={cn(
        "p-3 rounded-full transition-colors duration-300",
        isSelected ? "bg-white/20" : "bg-gray-100"
      )}>
        {getIcon()}
      </div>
      <span className="font-medium">{title}</span>
    </button>
  );
};

export default ServiceCategoryButton;

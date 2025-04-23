
import React from 'react';
import { Link } from 'react-router-dom';
import { MandalaButton } from '@/components/MandalaButton';
import { LucideIcon } from 'lucide-react';

interface ServiceOption {
  title: string;
  description: string;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  options: ServiceOption[];
  linkPath: string;
  linkText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  options, 
  linkPath, 
  linkText 
}) => {
  return (
    <div className="service-card">
      <div className="mb-6">
        <div className="p-3 rounded-full bg-peacefulBlue/10 inline-block mb-4">
          <Icon className="h-8 w-8 text-peacefulBlue" />
        </div>
        <h2 className="text-3xl font-lora font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="space-y-6 mb-8">
        {options.map((option, index) => (
          <div key={index}>
            <h3 className="text-xl font-lora font-medium text-gray-800 mb-2">{option.title}</h3>
            <p className="text-gray-600">{option.description}</p>
          </div>
        ))}
      </div>
      
      <Link to={linkPath} className="block w-full mt-4">
        <MandalaButton
          variant="primary"
          mandalaType="simple"
          className="w-full py-5 text-xl font-bold"
        >
          {linkText}
        </MandalaButton>
      </Link>
    </div>
  );
};

export default ServiceCard;


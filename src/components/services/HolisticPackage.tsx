
import React from 'react';
import { Link } from 'react-router-dom';
import { FractalButton } from '@/components/FractalButton';
import { LucideIcon } from 'lucide-react';
import SiteCard from "@/components/SiteCard";

interface HolisticPackageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  linkPath: string;
  linkText: string;
  iconColor: string;
  dotColor: string;
}

const HolisticPackage: React.FC<HolisticPackageProps> = ({
  icon: Icon,
  title,
  description,
  features,
  linkPath,
  linkText,
  iconColor,
  dotColor
}) => {
  return (
    <SiteCard className="flex flex-col h-full">
      <div className="flex-grow">
        <div className="mb-6 flex items-center">
          <div className={`p-3 rounded-full ${iconColor} mr-4 flex items-center justify-center`}>
            <Icon className={`h-7 w-7 ${dotColor}`} />
          </div>
          <h3 className="text-xl font-lora font-semibold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        <ul className="mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-gray-700">
              <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4">
        <FractalButton asChild fractalType="primary" className="w-full">
          <Link to={linkPath}>{linkText}</Link>
        </FractalButton>
      </div>
    </SiteCard>
  );
};

export default HolisticPackage;

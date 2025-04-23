
import React from 'react';
import { Link } from 'react-router-dom';
import { MandalaButton } from '@/components/MandalaButton';
import { LucideIcon, Loader2 } from 'lucide-react';
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
  price?: string;
  isLoading?: boolean;
}

const HolisticPackage: React.FC<HolisticPackageProps> = ({
  icon: Icon,
  title,
  description,
  features,
  linkPath,
  linkText,
  iconColor,
  dotColor,
  price,
  isLoading = false
}) => {
  return (
    <SiteCard className="flex flex-col h-full">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${iconColor} mr-4 flex items-center justify-center`}>
              <Icon className={`h-7 w-7 ${dotColor}`} />
            </div>
            <h3 className="text-xl font-lora font-semibold text-gray-800">{title}</h3>
          </div>
          {isLoading ? (
            <div className="text-gray-400 flex items-center">
              <Loader2 className="h-4 w-4 mr-1 animate-spin" /> 
              <span className="text-sm">Loading price</span>
            </div>
          ) : price ? (
            <div className="text-lg font-medium text-peacefulBlue">
              {price}
            </div>
          ) : null}
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

      <div className="mt-auto flex items-end">
        <Link to={linkPath} className="block w-full mt-2">
          <MandalaButton
            variant="primary"
            mandalaType="simple"
            className="w-full py-5 text-xl font-bold"
          >
            {linkText}
          </MandalaButton>
        </Link>
      </div>
    </SiteCard>
  );
};

export default HolisticPackage;

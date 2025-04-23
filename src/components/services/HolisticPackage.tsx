
import React from 'react';
import { Link } from 'react-router-dom';
import { MandalaButton } from '@/components/MandalaButton';
import { LucideIcon } from 'lucide-react';

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
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="mb-6 flex items-center">
        <div className={`p-3 rounded-full ${iconColor} mr-4`}>
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
      
      <Link to={linkPath} className="block w-full mt-2">
        <MandalaButton
          variant="teal"
          mandalaType="simple"
          className="w-full py-6 text-[2rem] font-bold"
        >
          Learn More
        </MandalaButton>
      </Link>
    </div>
  );
};

export default HolisticPackage;


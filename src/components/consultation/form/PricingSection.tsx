
import React from 'react';
import PriceSummary from '../PriceSummary';

interface PricingSectionProps {
  selectedServices: string[];
  pricing: Map<string, number>;
  totalPrice: number;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  selectedServices,
  pricing,
  totalPrice
}) => {
  if (selectedServices.length === 0) {
    return null;
  }
  
  return (
    <PriceSummary 
      services={selectedServices}
      pricing={pricing}
      totalPrice={totalPrice}
      currency="INR"
    />
  );
};

export default PricingSection;


import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import ServiceOption from './ServiceOption';
import { formatPrice } from '@/utils/pricing/priceFormatter';

type MentalHealthServicesProps = {
  consultationType: string;
  handleBoxClick: (value: string) => void;
  pricing?: Map<string, number>;
};

const MentalHealthServices: React.FC<MentalHealthServicesProps> = ({
  consultationType,
  handleBoxClick,
  pricing
}) => {
  const mentalHealthOptions = [
    {
      id: 'mental-health-counselling',
      title: 'Mental Health Counselling',
      description: 'Speak with a therapist about anxiety, depression, or stress related to relationships.'
    },
    {
      id: 'family-therapy',
      title: 'Family Therapy',
      description: 'Strengthen family bonds by addressing conflicts and fostering understanding.'
    },
    {
      id: 'premarital-counselling-individual',
      title: 'Premarital Counselling - Individual',
      description: 'Prepare for a strong marriage through guided personal reflection.'
    },
    {
      id: 'premarital-counselling-couple',
      title: 'Premarital Counselling - Couple',
      description: 'Build a foundation for marriage together through guided discussions.'
    },
    {
      id: 'couples-counselling', 
      title: 'Couples Counselling',
      description: 'Professional guidance to strengthen communication and mutual understanding.'
    },
    {
      id: 'sexual-health-counselling',
      title: 'Sexual Health Counselling',
      description: 'Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.'
    },
    {
      id: 'test-service',
      title: 'Test Service',
      description: 'For testing payment gateway functionality.'
    }
  ];

  // Log the current consultationType and pricing to help with debugging
  console.log("Mental Health Services - Current consultationType:", consultationType);
  console.log("Mental Health Services - Pricing data:", pricing ? Object.fromEntries(pricing) : "No pricing data");

  return (
    <RadioGroup value={consultationType} onValueChange={handleBoxClick} className="space-y-4">
      {mentalHealthOptions.map(option => {
        // Get price if available
        const price = pricing?.get(option.id);
        // Create title with price if available
        const titleWithPrice = price 
          ? `${option.title} (${formatPrice(price)})`
          : option.title;
        
        return (
          <ServiceOption
            key={option.id}
            id={option.id}
            title={titleWithPrice}
            description={option.description}
            isSelected={consultationType === option.id}
            onChange={(checked) => {
              if (checked) handleBoxClick(option.id);
            }}
          />
        );
      })}
    </RadioGroup>
  );
};

export default MentalHealthServices;

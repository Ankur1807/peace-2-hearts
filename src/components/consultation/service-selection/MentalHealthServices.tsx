
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (pricing) {
      console.log("MentalHealthServices - Pricing data received:", Object.fromEntries(pricing));
      console.log("MentalHealthServices - Test service price:", pricing.get('test-service'));
    } else {
      console.log("MentalHealthServices - No pricing data received");
    }
  }, [pricing]);

  return (
    <RadioGroup value={consultationType} onValueChange={handleBoxClick} className="space-y-4">
      {mentalHealthOptions.map(option => {
        const price = pricing?.get(option.id);
        const titleWithPrice = price !== undefined
          ? `${option.title} (${formatPrice(price)})`
          : option.title;
        
        const displayTitle = option.id === 'test-service' && price === undefined
          ? `${option.title} (₹11)` 
          : titleWithPrice;
        
        return (
          <ServiceOption
            key={option.id}
            id={option.id}
            title={displayTitle}
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


import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import ServiceOption from './ServiceOption';

type MentalHealthServicesProps = {
  consultationType: string;
  handleBoxClick: (value: string) => void;
};

const MentalHealthServices: React.FC<MentalHealthServicesProps> = ({
  consultationType,
  handleBoxClick
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
      id: 'premarital-counselling',
      title: 'Premarital Counselling',
      description: 'Prepare for a strong marriage through guided discussions and planning.'
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
      title: 'Test Service (₹11)',
      description: 'For testing payment gateway functionality.'
    }
  ];

  return (
    <RadioGroup value={consultationType} onValueChange={handleBoxClick} className="space-y-4">
      {mentalHealthOptions.map(option => (
        <ServiceOption
          key={option.id}
          id={option.id}
          title={option.title}
          description={option.description}
          isSelected={consultationType === option.id}
          onClick={() => handleBoxClick(option.id)}
        />
      ))}
    </RadioGroup>
  );
};

export default MentalHealthServices;


import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import ServiceOption from './ServiceOption';

type LegalServicesProps = {
  consultationType: string;
  handleBoxClick: (value: string) => void;
};

const LegalServices: React.FC<LegalServicesProps> = ({
  consultationType,
  handleBoxClick
}) => {
  const legalOptions = [
    {
      id: 'pre-marriage-legal',
      title: 'Pre-marriage Legal Consultation',
      description: 'Guidance on rights, agreements, and legal aspects before marriage.'
    },
    {
      id: 'mediation',
      title: 'Mediation Services',
      description: 'Facilitating peaceful resolutions to legal disputes through collaborative dialogue.'
    },
    {
      id: 'divorce',
      title: 'Divorce Consultation',
      description: 'Expert insights into legal aspects of divorce to make informed decisions.'
    },
    {
      id: 'custody',
      title: 'Child Custody Consultation',
      description: 'Support for understanding and advocating in custody decisions for children.'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Consultation',
      description: 'Advice on alimony, financial support, and agreements for separated partners.'
    },
    {
      id: 'general-legal',
      title: 'General Legal Consultation',
      description: 'Broad legal insights tailored to your unique relationship challenges.'
    }
  ];

  return (
    <RadioGroup value={consultationType} onValueChange={handleBoxClick} className="space-y-4">
      {legalOptions.map(option => (
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

export default LegalServices;

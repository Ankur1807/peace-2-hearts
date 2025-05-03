
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import ServiceOption from './ServiceOption';
import { formatPrice } from '@/utils/pricing/priceFormatter';

type LegalServicesProps = {
  consultationType: string;
  handleBoxClick: (value: string) => void;
  pricing?: Map<string, number>;
};

const LegalServices: React.FC<LegalServicesProps> = ({
  consultationType,
  handleBoxClick,
  pricing
}) => {
  const legalOptions = [
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
      {legalOptions.map(option => {
        const price = pricing?.get(option.id);
        const titleWithPrice = price !== undefined
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

export default LegalServices;

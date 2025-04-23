
import React from 'react';

interface ServiceDurationProps {
  selectedServices: string[];
}

const ServiceDuration: React.FC<ServiceDurationProps> = ({ selectedServices }) => {
  if (selectedServices.includes('test-service')) {
    return (
      <div className="text-sm text-gray-600">
        Test service for payment system validation
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-600">
      60-minute consultation
    </div>
  );
};

export default ServiceDuration;

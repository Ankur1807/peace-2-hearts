
import React from 'react';
import SubServicesList from '@/components/SubServicesList';

interface MentalHealthServiceItem {
  id: string;
  title: string;
  description: string;
  path: string;
}

interface MentalHealthServicesListProps {
  services: MentalHealthServiceItem[];
}

const MentalHealthServicesList: React.FC<MentalHealthServicesListProps> = ({ services }) => {
  return (
    <div className="mt-12">
      <h2 className="section-title text-3xl mb-8 text-center">Our Mental Health Services</h2>
      <SubServicesList subServices={services} />
    </div>
  );
};

export default MentalHealthServicesList;

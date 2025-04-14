
import React from 'react';

interface MentalHealthBenefitsProps {
  benefits: string[];
}

const MentalHealthBenefits: React.FC<MentalHealthBenefitsProps> = ({ benefits }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-peacefulBlue/20 text-peacefulBlue mb-4">
            {index + 1}
          </div>
          <p className="text-gray-700">{item}</p>
        </div>
      ))}
    </div>
  );
};

export default MentalHealthBenefits;

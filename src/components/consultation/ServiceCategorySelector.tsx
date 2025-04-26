
import React from 'react';
import ServiceCategoryButton from './form/ServiceCategoryButton';

interface ServiceCategorySelectorProps {
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
}

const ServiceCategorySelector: React.FC<ServiceCategorySelectorProps> = ({
  serviceCategory,
  setServiceCategory
}) => {
  // Place holistic first in the array (per spec)
  const categories = [
    { id: 'holistic', title: 'Holistic', description: 'Comprehensive packages combining both mental health and legal support.' },
    { id: 'mental-health', title: 'Mental Health', description: 'Support through therapy and counseling to help you navigate relationship challenges.' },
    { id: 'legal', title: 'Legal', description: 'Expert legal consultation for marriage, divorce, maintenance, and custody matters.' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <ServiceCategoryButton
            key={category.id}
            category={category.id}
            title={category.title}
            isSelected={serviceCategory === category.id}
            onClick={() => setServiceCategory(category.id)}
          />
        ))}
      </div>

      {/* Only show the description for the selected category (if any) */}
      {serviceCategory && (
        <div className="p-4 bg-gray-50 rounded-lg mt-4">
          {categories.find(cat => cat.id === serviceCategory)?.description}
        </div>
      )}
    </div>
  );
};

export default ServiceCategorySelector;

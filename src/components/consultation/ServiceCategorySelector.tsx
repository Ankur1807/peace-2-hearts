
import React from 'react';
import ServiceCategoryButton from './form/ServiceCategoryButton';
import { motion } from 'framer-motion';

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
    { id: 'holistic', title: 'Holistic Packages', description: 'Comprehensive packages combining both mental health and legal support.' },
    { id: 'mental-health', title: 'Mental Health', description: 'Support through therapy and counseling to help you navigate relationship challenges.' },
    { id: 'legal', title: 'Legal', description: 'Expert legal consultation for marriage, divorce, maintenance, and custody matters.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <ServiceCategoryButton
            key={category.id}
            category={category.id}
            title={category.title}
            isSelected={serviceCategory === category.id}
            onClick={() => setServiceCategory(category.id)}
            index={index}
          />
        ))}
      </div>

      {/* Only show the description for the selected category (if any) */}
      {serviceCategory && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-gray-50/80 backdrop-blur-sm rounded-lg mt-4 text-center"
        >
          {categories.find(cat => cat.id === serviceCategory)?.description}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ServiceCategorySelector;

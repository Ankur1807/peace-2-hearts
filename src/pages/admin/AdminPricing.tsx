
import React from 'react';
import PricingTabs from '@/components/admin/PricingTabs';

const AdminPricing: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <PricingTabs defaultTab="services" />
    </div>
  );
};

export default AdminPricing;

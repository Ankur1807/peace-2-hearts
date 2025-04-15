
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PricingTabs from '@/components/admin/PricingTabs';

const AdminPricing = () => {
  return (
    <AdminLayout title="Services & Pricing" description="Manage service pricing, packages, and discount codes">
      <PricingTabs />
    </AdminLayout>
  );
};

export default AdminPricing;

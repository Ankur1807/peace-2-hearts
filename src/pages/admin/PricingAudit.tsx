
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PricingAudit from '@/components/admin/PricingAudit';
import { useAdmin } from '@/hooks/useAdminContext';
import { Navigate } from 'react-router-dom';

const PricingAuditPage: React.FC = () => {
  const { isAdmin, isLoading } = useAdmin();

  // Redirect non-admins
  if (!isLoading && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Service Pricing Audit</h1>
        <PricingAudit />
      </div>
    </AdminLayout>
  );
};

export default PricingAuditPage;

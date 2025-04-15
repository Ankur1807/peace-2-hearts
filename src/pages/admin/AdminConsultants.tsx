
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConsultantsManagement from '@/components/dashboard/ConsultantsManagement';

const AdminConsultants = () => {
  return (
    <AdminLayout title="Consultants Management" description="Manage consultants on the Peace2Hearts platform">
      <ConsultantsManagement />
    </AdminLayout>
  );
};

export default AdminConsultants;


import React from 'react';
import PaymentMigrationPanel from '@/components/admin/PaymentMigrationPanel';

const AdminPaymentMigration: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment Migration</h1>
      <PaymentMigrationPanel />
    </div>
  );
};

export default AdminPaymentMigration;

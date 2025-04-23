
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdminContext';
import { usePackagePricing } from '@/hooks/usePackagePricing';
import PackageTable from './PackageTable';
import PackageSyncAlert from './PackageSyncAlert';
import PackagePricingHeader from './PackagePricingHeader';
import { ServicePrice } from '@/utils/pricing/types';

const PackagePricing = () => {
  const { isAdmin } = useAdmin();
  const {
    packages,
    loading,
    updating,
    syncNeeded,
    handleEditPrice,
    handleToggleStatus,
    handleSyncPackages,
    handleRefresh
  } = usePackagePricing();

  return (
    <Card>
      <PackagePricingHeader
        onRefresh={handleRefresh}
        onSync={handleSyncPackages}
        loading={loading}
        updating={updating}
        showSyncButton={syncNeeded}
      />
      
      <CardContent>
        {!isAdmin && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            You need admin privileges to make changes to package prices and status.
          </div>
        )}
        
        <PackageSyncAlert show={syncNeeded} />
        
        <PackageTable
          packages={packages as ServicePrice[]} 
          loading={loading}
          updating={updating}
          onEditPrice={handleEditPrice}
          onToggleStatus={handleToggleStatus}
        />
      </CardContent>
    </Card>
  );
};

export default PackagePricing;

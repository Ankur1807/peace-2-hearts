
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { updatePackagePrice, syncPackageIds } from '@/utils/pricing';
import { usePackageFetching } from './packages/usePackageFetching';
import { usePackageSync } from './packages/usePackageSync';
import { usePackageErrorHandler } from './packages/usePackageErrorHandler';

export function usePackagePricing() {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const { packages, loading, fetchPackages } = usePackageFetching();
  const { syncNeeded } = usePackageSync(packages);
  const { handleError } = usePackageErrorHandler();

  const handleEditPrice = async (id: string, price: number) => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to update packages.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdating(true);
      await updatePackagePrice(id, price);
      toast({
        title: 'Package Updated',
        description: 'Package price has been successfully updated.',
      });
      await fetchPackages();
    } catch (error: any) {
      handleError(error, 'update package price');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to update package status.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdating(true);
      const { error } = await supabase
        .from('service_pricing')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Package ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });
      await fetchPackages();
    } catch (error: any) {
      handleError(error, 'update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncPackages = async () => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to sync packages.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUpdating(true);
      // Process each unique package name
      const processedNames = new Set<string>();
      
      for (const pkg of packages) {
        if (!processedNames.has(pkg.service_name)) {
          processedNames.add(pkg.service_name);
          
          // Determine client ID
          let clientId = '';
          if (pkg.service_name.includes('Divorce Prevention')) {
            clientId = 'divorce-prevention';
          } else if (pkg.service_name.includes('Pre-Marriage Clarity')) {
            clientId = 'pre-marriage-clarity';
          }

          if (clientId && pkg.price) {
            await syncPackageIds(pkg.service_name, clientId, pkg.price);
          }
        }
      }

      toast({
        title: 'Packages Synced',
        description: 'All packages with the same name now have consistent pricing.',
      });
      await fetchPackages();
    } catch (error: any) {
      handleError(error, 'sync packages');
    } finally {
      setUpdating(false);
    }
  };

  return {
    packages,
    loading,
    updating,
    syncNeeded,
    handleEditPrice,
    handleToggleStatus,
    handleSyncPackages,
    handleRefresh: fetchPackages
  };
}

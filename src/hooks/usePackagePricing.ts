
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { ServicePrice } from '@/utils/pricing/types';
import { updatePackagePrice, syncPackageIds } from '@/utils/pricing';
import { supabase } from '@/integrations/supabase/client';

export function usePackagePricing() {
  const [packages, setPackages] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [syncNeeded, setSyncNeeded] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const fetchPackages = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_pricing')
        .select('*')
        .eq('type', 'package')
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('Fetched packages:', data);
      
      // Convert database response to ServicePrice array
      const typedPackages: ServicePrice[] = data?.map(pkg => ({
        ...pkg,
        type: pkg.type as 'service' | 'package',
        scenario: pkg.scenario || 'regular'
      })) || [];
      
      setPackages(typedPackages);

      // Check if any packages need syncing (have different prices for same name)
      const packagesMap = new Map();
      typedPackages.forEach(pkg => {
        if (!packagesMap.has(pkg.service_name)) {
          packagesMap.set(pkg.service_name, [pkg.price]);
        } else {
          packagesMap.get(pkg.service_name).push(pkg.price);
        }
      });

      // Check if any package has inconsistent prices
      let needsSync = false;
      packagesMap.forEach((prices, name) => {
        if (new Set(prices).size > 1) {
          needsSync = true;
        }
      });
      setSyncNeeded(needsSync);
    } catch (error: any) {
      handleError(error, 'fetch packages');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

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
      // Group packages by name
      const packageGroups = new Map<string, ServicePrice[]>();
      packages.forEach(pkg => {
        if (!packageGroups.has(pkg.service_name)) {
          packageGroups.set(pkg.service_name, [pkg]);
        } else {
          packageGroups.get(pkg.service_name)?.push(pkg);
        }
      });

      // Sync each group
      for (const [name, pkgs] of packageGroups.entries()) {
        if (pkgs.length > 1) {
          // Find the latest active package
          const activePkgs = pkgs.filter(p => p.is_active);
          if (activePkgs.length > 0) {
            const latestPkg = activePkgs.reduce((latest, current) => {
              return new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest;
            });

            // Determine client ID
            let clientId = '';
            if (name.includes('Divorce Prevention')) {
              clientId = 'divorce-prevention';
            } else if (name.includes('Pre-Marriage Clarity')) {
              clientId = 'pre-marriage-clarity';
            }

            if (clientId) {
              await syncPackageIds(name, clientId, latestPkg.price);
            }
          }
        }
      }

      toast({
        title: 'Packages Synced',
        description: 'All packages with the same name now have consistent pricing.',
      });
      await fetchPackages();
      setSyncNeeded(false);
    } catch (error: any) {
      handleError(error, 'sync packages');
    } finally {
      setUpdating(false);
    }
  };

  const handleError = (error: any, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
      toast({
        title: 'Session Expired',
        description: 'Your admin session has expired. Please log in again.',
        variant: 'destructive',
      });
      localStorage.removeItem('p2h_admin_authenticated');
    } else {
      toast({
        title: 'Error',
        description: `Failed to ${operation}: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
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


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ServicePrice } from '@/utils/pricingTypes';
import { syncPackageIds, updatePackagePrice } from '@/utils/pricing/serviceOperations';

export const usePackagePricing = () => {
  const [packages, setPackages] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [syncNeeded, setSyncNeeded] = useState(false);
  const { toast } = useToast();

  const fetchPackages = async (showMessage = false) => {
    try {
      setLoading(true);
      console.log('Fetching packages from Supabase...');
      
      const { data, error } = await supabase
        .from('service_pricing')
        .select('*')
        .eq('type', 'package')
        .order('service_name', { ascending: true });

      if (error) {
        console.error('Error fetching packages:', error);
        toast({
          title: 'Error',
          description: `Failed to fetch packages: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        const packageGroups = new Map<string, ServicePrice[]>();
        data.forEach(pkg => {
          if (!packageGroups.has(pkg.service_name)) {
            packageGroups.set(pkg.service_name, []);
          }
          packageGroups.get(pkg.service_name)!.push(pkg);
        });
        
        let inconsistencyFound = false;
        packageGroups.forEach((pkgs, name) => {
          if (pkgs.length > 1) {
            const prices = [...new Set(pkgs.map(p => p.price))];
            if (prices.length > 1) {
              console.warn(`Inconsistent pricing found for package '${name}': ${prices.join(', ')}`);
              inconsistencyFound = true;
            }
          }
        });
        
        setSyncNeeded(inconsistencyFound);
        setPackages(data);
      }
      
      if (showMessage && data) {
        toast({
          title: 'Refresh Complete',
          description: `Successfully loaded ${data.length} packages`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch packages: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrice = async (id: string, price: number) => {
    try {
      setUpdating(true);
      console.log(`Updating package ID ${id} with new price: ${price}`);
      
      const { data: packageData } = await supabase
        .from('package_pricing')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!packageData) {
        throw new Error("Package not found");
      }
      
      await updatePackagePrice(id, price);
      
      if (packageData.package_name.toLowerCase().includes('divorce prevention')) {
        await syncPackageIds('Divorce Prevention Package', 'divorce-prevention', price);
      } else if (packageData.package_name.toLowerCase().includes('pre-marriage clarity')) {
        await syncPackageIds('Pre-Marriage Clarity Package', 'pre-marriage-clarity', price);
      }
      
      toast({
        title: 'Price Updated',
        description: 'Package price has been successfully updated.',
      });

      await fetchPackages();
    } catch (error: any) {
      console.error('Failed to update price:', error);
      toast({
        title: 'Error',
        description: `Failed to update price: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(true);
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase
        .from('package_pricing')
        .update({ 
          is_active: !currentStatus, 
          updated_at: timestamp
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: 'Status Updated',
        description: `Package ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      await fetchPackages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncPackages = async () => {
    try {
      setUpdating(true);
      
      await syncPackageIds('Divorce Prevention Package', 'divorce-prevention', 8500);
      await syncPackageIds('Pre-Marriage Clarity Package', 'pre-marriage-clarity', 7500);
      
      toast({
        title: 'Packages Synchronized',
        description: 'All package IDs and prices have been synchronized.',
      });
      
      setSyncNeeded(false);
      await fetchPackages();
    } catch (error: any) {
      console.error('Failed to sync packages:', error);
      toast({
        title: 'Error',
        description: `Failed to sync packages: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    updating,
    syncNeeded,
    handleEditPrice,
    handleToggleStatus,
    handleSyncPackages,
    handleRefresh: () => fetchPackages(true)
  };
};

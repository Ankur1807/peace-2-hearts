
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { ServicePrice } from '@/utils/pricing/types';
import { supabase } from '@/integrations/supabase/client';
import { usePackageErrorHandler } from './usePackageErrorHandler';

export const usePackageFetching = () => {
  const [packages, setPackages] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const { handleError } = usePackageErrorHandler();

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
      
      const typedPackages: ServicePrice[] = data?.map(pkg => ({
        ...pkg,
        type: pkg.type as 'service' | 'package',
        scenario: pkg.scenario || 'regular'
      })) || [];
      
      setPackages(typedPackages);
    } catch (error: any) {
      handleError(error, 'fetch packages');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast, handleError]);

  return {
    packages,
    loading,
    fetchPackages
  };
};

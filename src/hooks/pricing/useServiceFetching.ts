
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServicePrice } from '@/utils/pricing/types';
import { fetchAllServices, addInitialServices } from '@/utils/pricing';
import { useAdmin } from '@/hooks/useAdminContext';
import { handleOperationError } from './pricingErrorHandler';

export const useServiceFetching = () => {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const fetchServices = useCallback(async () => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to access pricing data.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching services with admin status:", isAdmin);
      
      let data = await fetchAllServices();
      
      if (data.length === 0) {
        await addInitialServices();
        data = await fetchAllServices();
      }
      
      console.log('Fetched services data:', data);
      setServices(data);
    } catch (error: any) {
      handleOperationError(error, 'fetch services', toast);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  return {
    services,
    loading,
    fetchServices,
  };
};

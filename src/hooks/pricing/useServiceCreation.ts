
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { NewServiceFormValues } from '@/utils/pricing/types';
import { createService } from '@/utils/pricing';
import { handleOperationError } from './pricingErrorHandler';

export const useServiceCreation = (onServiceCreated: () => Promise<void>) => {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const addNewService = async (data: NewServiceFormValues) => {
    try {
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to add services.',
          variant: 'destructive',
        });
        return false;
      }

      console.log("Adding new service with data:", data);
      await createService(data);
      
      toast({
        title: 'Service Added',
        description: 'New service has been successfully added.',
      });

      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await onServiceCreated();
      }, 500);
      return true;
    } catch (error: any) {
      handleOperationError(error, 'add service', toast);
      return false;
    }
  };

  return { addNewService };
};

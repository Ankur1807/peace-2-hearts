
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { removeService } from '@/utils/pricing';
import { handleOperationError } from './pricingErrorHandler';

export const useServiceDeletion = (onServiceDeleted: () => Promise<void>) => {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const deleteService = async (id: string) => {
    try {
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to delete services.',
          variant: 'destructive',
        });
        return false;
      }

      await removeService(id);
      
      toast({
        title: 'Service Deleted',
        description: 'Service has been successfully deleted.',
      });

      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await onServiceDeleted();
      }, 500);
      return true;
    } catch (error: any) {
      handleOperationError(error, 'delete service', toast);
      return false;
    }
  };

  return { deleteService };
};

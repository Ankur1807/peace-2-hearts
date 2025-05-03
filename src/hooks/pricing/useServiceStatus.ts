
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdminContext';
import { toggleServiceActive } from '@/utils/pricing';
import { handleOperationError } from './pricingErrorHandler';

export const useServiceStatus = (onStatusToggled: () => Promise<void>) => {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (!isAdmin) {
        toast({
          title: 'Authentication Required - You must be logged in as an admin to update service status.',
          variant: 'destructive',
        });
        return;
      }

      await toggleServiceActive(id, currentStatus);
      
      toast({
        title: `Status Updated - Service ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await onStatusToggled();
      }, 500);
    } catch (error: any) {
      handleOperationError(error, 'update status', toast);
    }
  };

  return { toggleStatus };
};

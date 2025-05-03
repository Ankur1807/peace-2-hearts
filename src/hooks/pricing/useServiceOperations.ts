
import { useToast } from '@/hooks/use-toast';
import { toggleServiceActive, updateServicePrice, createService, removeService } from '@/utils/pricing';
import { NewServiceFormValues } from '@/utils/pricing/types';
import { useAdmin } from '@/hooks/useAdminContext';
import { handleOperationError } from './pricingErrorHandler';

export const useServiceOperations = () => {
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to update service status.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      await toggleServiceActive(id, currentStatus);
      toast({
        title: 'Status Updated',
        description: `Service ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });
      return true;
    } catch (error: any) {
      handleOperationError(error, 'update status', toast);
      return false;
    }
  };

  const handleEditPrice = async (id: string, price: number) => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to update prices.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      await updateServicePrice(id, price);
      toast({
        title: 'Price Updated',
        description: 'Service price has been successfully updated.',
      });
      return true;
    } catch (error: any) {
      handleOperationError(error, 'update price', toast);
      return false;
    }
  };

  const handleAddService = async (data: NewServiceFormValues) => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to add services.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      await createService(data);
      toast({
        title: 'Service Added',
        description: 'New service has been successfully added.',
      });
      return true;
    } catch (error: any) {
      handleOperationError(error, 'add service', toast);
      return false;
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!isAdmin) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to delete services.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      await removeService(id);
      toast({
        title: 'Service Deleted',
        description: 'Service has been successfully deleted.',
      });
      return true;
    } catch (error: any) {
      handleOperationError(error, 'delete service', toast);
      return false;
    }
  };

  return {
    handleToggleStatus,
    handleEditPrice,
    handleAddService,
    handleDeleteService,
  };
};

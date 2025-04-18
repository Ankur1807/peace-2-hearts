
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServicePrice } from '@/utils/pricingTypes';
import { NewServiceFormValues } from '@/components/pricing/AddServiceForm';
import { 
  fetchAllServices, 
  updateServicePrice, 
  toggleServiceActive, 
  createService, 
  removeService 
} from '@/utils/pricing/serviceOperations';
import { addInitialServices } from '@/utils/pricing/serviceInitializer';

export const usePricingServices = () => {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      let data: ServicePrice[];
      
      try {
        console.log('Fetching all services');
        data = await fetchAllServices();
        
        if (data.length === 0) {
          console.log('No services found, initializing...');
          await addInitialServices();
          data = await fetchAllServices();
        }
        
        console.log('Services fetched successfully:', data.length);
        setServices(data);
      } catch (error: any) {
        if (error.code === 'PGRST116') {
          toast({
            title: 'Authentication Error',
            description: 'You need to be logged in as an admin to access pricing data.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch services: ${error.message}`,
        variant: 'destructive',
      });
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string, currentPrice: number) => {
    setEditMode(id);
    setEditedPrice(currentPrice.toString());
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditedPrice('');
  };

  const handleSave = async (id: string) => {
    try {
      setUpdating(true);
      
      if (!editedPrice.trim() || isNaN(Number(editedPrice)) || Number(editedPrice) <= 0) {
        toast({
          title: 'Invalid Price',
          description: 'Please enter a valid price.',
          variant: 'destructive',
        });
        return;
      }

      console.log(`Saving price update for service ID ${id}: ${editedPrice}`);
      await updateServicePrice(id, Number(editedPrice));

      toast({
        title: 'Price Updated',
        description: 'Service price has been successfully updated.',
      });

      setEditMode(null);
      await fetchServices(); // Refresh services after update
    } catch (error: any) {
      handleOperationError(error, 'update price');
    } finally {
      setUpdating(false);
    }
  };

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(true);
      console.log(`Toggling service status for ID ${id} from ${currentStatus} to ${!currentStatus}`);
      await toggleServiceActive(id, currentStatus);
      
      toast({
        title: 'Status Updated',
        description: `Service ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      await fetchServices(); // Refresh services after update
    } catch (error: any) {
      handleOperationError(error, 'update status');
    } finally {
      setUpdating(false);
    }
  };

  const addNewService = async (data: NewServiceFormValues) => {
    try {
      setUpdating(true);
      console.log('Adding new service:', data);
      await createService(data);
      
      toast({
        title: 'Service Added',
        description: 'New service has been successfully added.',
      });

      return true;
    } catch (error: any) {
      handleOperationError(error, 'add service');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      setUpdating(true);
      console.log(`Deleting service with ID ${id}`);
      await removeService(id);
      
      toast({
        title: 'Service Deleted',
        description: 'Service has been successfully deleted.',
      });

      return true;
    } catch (error: any) {
      handleOperationError(error, 'delete service');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Helper function to handle operation errors
  const handleOperationError = (error: any, operation: string) => {
    if (error.code === 'PGRST116') {
      toast({
        title: 'Permission Denied',
        description: `You do not have permission to ${operation}. Please make sure you are logged in as an admin.`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to ${operation}: ${error.message}`,
        variant: 'destructive',
      });
    }
    console.error(`Error: ${operation}:`, error);
  };

  return {
    services,
    loading,
    updating,
    editMode,
    editedPrice,
    setEditedPrice,
    fetchServices,
    handleEdit,
    handleCancel,
    handleSave,
    toggleServiceStatus,
    addNewService,
    deleteService,
  };
};

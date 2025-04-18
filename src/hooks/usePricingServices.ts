
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
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      setLoading(true);
      let data: ServicePrice[];
      
      try {
        data = await fetchAllServices();
        
        if (data.length === 0) {
          await addInitialServices();
          data = await fetchAllServices();
        }
        
        console.log('Fetched services data:', data);
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
      if (!editedPrice.trim() || isNaN(Number(editedPrice)) || Number(editedPrice) <= 0) {
        toast({
          title: 'Invalid Price',
          description: 'Please enter a valid price.',
          variant: 'destructive',
        });
        return;
      }

      const numericPrice = Number(editedPrice);
      console.log(`Saving price ${numericPrice} for service ID ${id}`);
      
      const updatedServices = await updateServicePrice(id, numericPrice);

      toast({
        title: 'Price Updated',
        description: 'Service price has been successfully updated.',
      });

      setEditMode(null);
      
      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await fetchServices();
      }, 500);
    } catch (error: any) {
      handleOperationError(error, 'update price');
    }
  };

  const toggleServiceStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleServiceActive(id, currentStatus);
      
      toast({
        title: 'Status Updated',
        description: `Service ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await fetchServices();
      }, 500);
    } catch (error: any) {
      handleOperationError(error, 'update status');
    }
  };

  const addNewService = async (data: NewServiceFormValues) => {
    try {
      await createService(data);
      
      toast({
        title: 'Service Added',
        description: 'New service has been successfully added.',
      });

      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await fetchServices();
      }, 500);
      return true;
    } catch (error: any) {
      handleOperationError(error, 'add service');
      return false;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await removeService(id);
      
      toast({
        title: 'Service Deleted',
        description: 'Service has been successfully deleted.',
      });

      // Add a slight delay before refreshing to ensure the database has processed the update
      setTimeout(async () => {
        await fetchServices();
      }, 500);
      return true;
    } catch (error: any) {
      handleOperationError(error, 'delete service');
      return false;
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

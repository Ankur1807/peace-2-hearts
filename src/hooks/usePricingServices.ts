
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServicePrice, NewServiceFormValues } from '@/utils/pricing/types';
import { 
  updateServicePrice, 
  toggleServiceActive, 
  createService, 
  removeService,
  fetchAllServices,
  addInitialServices
} from '@/utils/pricing';
import { useAdmin } from '@/hooks/useAdminContext';

export const usePricingServices = () => {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  // Use useCallback to memoize the fetchServices function
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
      
      try {
        // Fetch services data
        let data = await fetchAllServices();
        
        if (data.length === 0) {
          // If no services exist, add initial services
          await addInitialServices();
          data = await fetchAllServices();
        }
        
        console.log('Fetched services data:', data);
        setServices(data);
      } catch (error: any) {
        if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
          toast({
            title: 'Authentication Error',
            description: 'Your admin session may have expired. Please try logging in again.',
            variant: 'destructive',
          });
          localStorage.removeItem('p2h_admin_authenticated');
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
  }, [isAdmin, toast]);

  const handleEdit = useCallback((id: string, currentPrice: number) => {
    setEditMode(id);
    setEditedPrice(currentPrice.toString());
  }, []);

  const handleCancel = useCallback(() => {
    setEditMode(null);
    setEditedPrice('');
  }, []);

  const handleSave = useCallback(async (id: string) => {
    try {
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to update prices.',
          variant: 'destructive',
        });
        return;
      }

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
      
      await updateServicePrice(id, numericPrice);

      toast({
        title: 'Price Updated',
        description: 'Service price has been successfully updated.',
      });

      setEditMode(null);
      
      // Update the service in the local state without refetching
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === id 
            ? { ...service, price: numericPrice } 
            : service
        )
      );
      
    } catch (error: any) {
      handleOperationError(error, 'update price');
    }
  }, [editedPrice, isAdmin, toast]);

  const toggleServiceStatus = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to update service status.',
          variant: 'destructive',
        });
        return;
      }

      await toggleServiceActive(id, currentStatus);
      
      toast({
        title: 'Status Updated',
        description: `Service ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      // Update local state without refetching
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === id 
            ? { ...service, is_active: !currentStatus } 
            : service
        )
      );
      
    } catch (error: any) {
      handleOperationError(error, 'update status');
    }
  }, [isAdmin, toast]);

  const addNewService = useCallback(async (data: NewServiceFormValues) => {
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

      // Fetch services again to include the new one
      await fetchServices();
      return true;
    } catch (error: any) {
      handleOperationError(error, 'add service');
      return false;
    }
  }, [isAdmin, toast, fetchServices]);

  const deleteService = useCallback(async (id: string) => {
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

      // Update local state without refetching
      setServices(prevServices => prevServices.filter(service => service.id !== id));
      return true;
    } catch (error: any) {
      handleOperationError(error, 'delete service');
      return false;
    }
  }, [isAdmin, toast]);

  const handleOperationError = (error: any, operation: string) => {
    console.error(`Error details for ${operation}:`, error);
    
    if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
      toast({
        title: 'Session Expired',
        description: 'Your admin session has expired. Please log in again.',
        variant: 'destructive',
      });
      localStorage.removeItem('p2h_admin_authenticated');
    } else if (error.message?.includes('Authentication required')) {
      toast({
        title: 'Authentication Required',
        description: `You must be logged in as an admin to ${operation}.`,
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

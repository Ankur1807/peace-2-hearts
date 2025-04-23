import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ServicePrice } from '@/utils/pricingTypes';
import { NewServiceFormValues } from '@/components/pricing/AddServiceForm';
import { 
  cmdUpdateServicePrice, 
  cmdToggleServiceActive, 
  cmdCreateService, 
  cmdRemoveService,
  queryFetchAllServices 
} from '@/utils/pricing';
import { addInitialServices } from '@/utils/pricing/serviceInitializer';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdminContext';

export const usePricingServices = () => {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string>('');
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const fetchServices = async () => {
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
        let data = await queryFetchAllServices();
        
        if (data.length === 0) {
          // If no services exist, add initial services
          await addInitialServices();
          data = await queryFetchAllServices();
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
      
      await cmdUpdateServicePrice(id, numericPrice);

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
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to update service status.',
          variant: 'destructive',
        });
        return;
      }

      await cmdToggleServiceActive(id, currentStatus);
      
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
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to add services.',
          variant: 'destructive',
        });
        return false;
      }

      console.log("Adding new service with data:", data);
      await cmdCreateService(data);
      
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
      if (!isAdmin) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in as an admin to delete services.',
          variant: 'destructive',
        });
        return false;
      }

      await cmdRemoveService(id);
      
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

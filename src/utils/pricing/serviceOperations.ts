
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';
import { NewServiceFormValues } from '@/components/pricing/AddServiceForm';

export const fetchAllServices = async () => {
  console.log('Fetching all services');
  const { data, error } = await supabase
    .from('service_pricing')
    .select('*')
    .order('category', { ascending: true })
    .order('service_name', { ascending: true });

  if (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} services from database`);
  return data as ServicePrice[] || [];
};

export const updateServicePrice = async (id: string, price: number) => {
  console.log(`Updating service price for ID ${id} to ${price}`);
  const { data, error } = await supabase
    .from('service_pricing')
    .update({ price, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating service price:', error);
    throw error;
  }
  
  console.log('Service price updated:', data);
  return data;
};

export const toggleServiceActive = async (id: string, currentStatus: boolean) => {
  console.log(`Toggling service active status for ID ${id} from ${currentStatus} to ${!currentStatus}`);
  const { data, error } = await supabase
    .from('service_pricing')
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error toggling service active status:', error);
    throw error;
  }
  
  console.log('Service active status toggled:', data);
  return data;
};

export const createService = async (data: NewServiceFormValues) => {
  console.log('Creating new service:', data);
  const { data: newService, error } = await supabase
    .from('service_pricing')
    .insert([{
      service_name: data.service_name,
      service_id: data.service_id,
      price: data.price,
      category: data.category,
      currency: 'INR',
      is_active: true,
      scenario: 'regular',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }
  
  console.log('New service created:', newService);
  return newService;
};

export const removeService = async (id: string) => {
  console.log(`Removing service with ID ${id}`);
  const { data, error } = await supabase
    .from('service_pricing')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error removing service:', error);
    throw error;
  }
  
  console.log('Service removed:', data);
  return data;
};

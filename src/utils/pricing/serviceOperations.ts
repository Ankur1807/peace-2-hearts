
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';
import { NewServiceFormValues } from '@/components/pricing/AddServiceForm';

export const fetchAllServices = async () => {
  console.log('Fetching all services');
  try {
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
  } catch (error) {
    console.error('Error in fetchAllServices:', error);
    throw error;
  }
};

export const fetchInitialServices = async () => {
  console.log('Fetching initial service data');
  try {
    // First check if we already have services in the database
    const { data, error } = await supabase
      .from('service_pricing')
      .select('count(*)');

    if (error) {
      console.error('Error checking for services:', error);
      throw error;
    }

    // If we have services, just return
    if (data && data[0]?.count > 0) {
      console.log(`Found ${data[0].count} existing services, no need to initialize`);
      return;
    }

    // If no services, let's add some default ones
    console.log('No services found, adding default services');
    
    const defaultServices = [
      {
        service_name: "Mental Health Counselling",
        service_id: "mental-health-counselling",
        price: 2500,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Family Therapy",
        service_id: "family-therapy",
        price: 3000,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Couples Counselling",
        service_id: "couples-counselling",
        price: 3000,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Premarital Counselling",
        service_id: "premarital-counselling",
        price: 2500,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "General Legal Consultation",
        service_id: "general-legal",
        price: 2000, 
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Divorce Consultation",
        service_id: "divorce-legal",
        price: 3500,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Custody Consultation",
        service_id: "custody-legal",
        price: 3500,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Mediation Service",
        service_id: "mediation",
        price: 4000,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Pre-Marriage Legal",
        service_id: "pre-marriage-legal",
        price: 2500,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      }
    ];
    
    // Insert the default services
    const { error: insertError } = await supabase
      .from('service_pricing')
      .insert(defaultServices.map(service => ({
        ...service,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));

    if (insertError) {
      console.error('Error inserting default services:', insertError);
      throw insertError;
    }

    console.log('Successfully added default services');

  } catch (error) {
    console.error('Error in fetchInitialServices:', error);
    throw error;
  }
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

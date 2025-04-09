
import { supabase } from '@/integrations/supabase/client';
import { ServicePrice } from '@/utils/pricingTypes';
import { NewServiceFormValues } from '@/components/pricing/AddServiceForm';

export const fetchAllServices = async () => {
  const { data, error } = await supabase
    .from('service_pricing')
    .select('*')
    .order('category', { ascending: true })
    .order('service_name', { ascending: true });

  if (error) throw error;
  return data as ServicePrice[] || [];
};

export const updateServicePrice = async (id: string, price: number) => {
  const { error } = await supabase
    .from('service_pricing')
    .update({ price, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

export const toggleServiceActive = async (id: string, currentStatus: boolean) => {
  const { error } = await supabase
    .from('service_pricing')
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

export const createService = async (data: NewServiceFormValues) => {
  const { error } = await supabase
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
    }]);

  if (error) throw error;
};

export const removeService = async (id: string) => {
  const { error } = await supabase
    .from('service_pricing')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

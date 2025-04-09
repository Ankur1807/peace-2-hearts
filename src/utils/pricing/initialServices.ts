
import { supabase } from '@/integrations/supabase/client';

const DEFAULT_SERVICES = [
  { service_name: 'Individual Therapy', service_id: 'therapy-individual', price: 2500, category: 'mental-health', is_active: true },
  { service_name: 'Couples Counselling', service_id: 'therapy-couples', price: 3000, category: 'mental-health', is_active: true },
  { service_name: 'Family Therapy', service_id: 'therapy-family', price: 3500, category: 'mental-health', is_active: true },
  { service_name: 'Premarital Counselling', service_id: 'therapy-premarital', price: 2800, category: 'mental-health', is_active: true },
  { service_name: 'Relationship Counselling', service_id: 'therapy-relationship', price: 3000, category: 'mental-health', is_active: true },
  
  { service_name: 'Divorce Consultation', service_id: 'legal-divorce', price: 5000, category: 'legal', is_active: true },
  { service_name: 'Child Custody Consultation', service_id: 'legal-custody', price: 4500, category: 'legal', is_active: true },
  { service_name: 'Legal Document Review', service_id: 'legal-document', price: 3000, category: 'legal', is_active: true },
  { service_name: 'Court Representation', service_id: 'legal-court', price: 10000, category: 'legal', is_active: true },
  { service_name: 'Maintenance Consultation', service_id: 'legal-maintenance', price: 3500, category: 'legal', is_active: true },
  
  { service_name: 'Meditation Session', service_id: 'holistic-meditation', price: 1500, category: 'holistic', is_active: true },
  { service_name: 'Yoga Therapy', service_id: 'holistic-yoga', price: 1800, category: 'holistic', is_active: true },
  { service_name: 'Art Therapy', service_id: 'holistic-art', price: 2000, category: 'holistic', is_active: true },
  { service_name: 'Naturopathy Consultation', service_id: 'holistic-naturopathy', price: 2500, category: 'holistic', is_active: true },
];

export const addInitialServices = async () => {
  try {
    for (const service of DEFAULT_SERVICES) {
      const { error } = await supabase
        .from('service_pricing')
        .insert([{
          ...service,
          currency: 'INR',
          scenario: 'regular',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);
        
      if (error) {
        console.error('Error adding initial service:', error);
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to add initial services:', error);
    return false;
  }
};

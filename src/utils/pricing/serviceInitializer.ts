
import { supabase } from '@/integrations/supabase/client';

// Initial services to populate the database if empty
const initialServices = [
  // Mental Health Services
  {
    service_name: 'Mental Health Counselling',
    service_id: 'P2H-MH-mental-health-counselling',
    price: 1500,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Family Therapy',
    service_id: 'P2H-MH-family-therapy',
    price: 2500,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Premarital Counselling - Individual',
    service_id: 'P2H-MH-premarital-counselling-individual',
    price: 1500,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Premarital Counselling - Couple',
    service_id: 'P2H-MH-premarital-counselling-couple',
    price: 2500,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Couples Counselling',
    service_id: 'P2H-MH-couples-counselling',
    price: 2500, 
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Sexual Health Counselling',
    service_id: 'P2H-MH-sexual-health-counselling',
    price: 1800,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Test Service',
    service_id: 'P2H-MH-test-service',
    price: 11,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  
  // Legal Services
  {
    service_name: 'Pre-marriage Legal Consultation',
    service_id: 'P2H-L-pre-marriage-legal-consultation',
    price: 2000,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Mediation Services',
    service_id: 'P2H-L-mediation-services',
    price: 4000,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Divorce Consultation',
    service_id: 'P2H-L-divorce-consultation',
    price: 2200,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Child Custody Consultation',
    service_id: 'P2H-L-child-custody-consultation',
    price: 2500,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Maintenance Consultation',
    service_id: 'P2H-L-maintenance-consultation',
    price: 2500,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'General Legal Consultation',
    service_id: 'P2H-L-general-legal-consultation',
    price: 1500,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  
  // Holistic Packages
  {
    service_name: 'Divorce Prevention Package',
    service_id: 'P2H-H-divorce-prevention-package',
    price: 7500,
    category: 'holistic',
    type: 'package',
    is_active: true,
    services: ['P2H-MH-couples-counselling', 'P2H-MH-mental-health-counselling', 'P2H-L-mediation-services', 'P2H-L-general-legal-consultation']
  },
  {
    service_name: 'Pre-Marriage Clarity Solutions',
    service_id: 'P2H-H-pre-marriage-clarity-solutions',
    price: 5000,
    category: 'holistic',
    type: 'package',
    is_active: true,
    services: ['P2H-L-pre-marriage-legal-consultation', 'P2H-MH-premarital-counselling-individual', 'P2H-MH-mental-health-counselling']
  }
];

// Fetch initial services data
export async function fetchInitialServices() {
  return initialServices;
}

// Add initial services to the database if none exist
export async function addInitialServices() {
  try {
    console.log('Checking if services already exist...');
    
    const { data, error } = await supabase
      .from('service_pricing')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error checking for existing services:', error);
      return false;
    }
    
    if (data && data.length > 0) {
      console.log('Services already exist, skipping initialization');
      return true;
    }
    
    console.log('No services found, adding initial services...');
    
    // Add a slight delay to ensure the session is loaded
    setTimeout(async () => {
      const session = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      const { error: insertError } = await supabase
        .from('service_pricing')
        .insert(initialServices);
      
      if (insertError) {
        console.error('Error adding initial services:', insertError);
        return false;
      }
      
      console.log('Initial services added successfully');
      return true;
    }, 500);
  } catch (error) {
    console.error('Exception adding initial services:', error);
    return false;
  }
}

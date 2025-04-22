import { supabase } from '@/integrations/supabase/client';

// Initial service pricing data
const initialServices = [
  {
    service_name: 'Mental Health Counselling',
    service_id: 'P2H-MH-mental-health-counselling',
    price: 2500,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Family Therapy',
    service_id: 'P2H-MH-family-therapy',
    price: 3000,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Premarital Counselling - Individual',
    service_id: 'P2H-MH-premarital-counselling-individual',
    price: 2200,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Premarital Counselling - Couple',
    service_id: 'P2H-MH-premarital-counselling-couple',
    price: 2800,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Couples Counselling',
    service_id: 'P2H-MH-couples-counselling',
    price: 3000,
    category: 'mental-health',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Legal Consultation - Pre-marriage',
    service_id: 'P2H-L-pre-marriage-legal',
    price: 3500,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Mediation Services',
    service_id: 'P2H-L-mediation',
    price: 4000,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Divorce Consultation',
    service_id: 'P2H-L-divorce',
    price: 3800,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Child Custody Consultation',
    service_id: 'P2H-L-custody',
    price: 3500,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Maintenance Consultation',
    service_id: 'P2H-L-maintenance',
    price: 3200,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'General Legal Consultation',
    service_id: 'P2H-L-general-legal',
    price: 3000,
    category: 'legal',
    type: 'service',
    is_active: true
  },
  {
    service_name: 'Divorce Prevention Package',
    service_id: 'P2H-H-divorce-prevention-package',
    price: 12500,
    category: 'holistic',
    type: 'package',
    is_active: true
  },
  {
    service_name: 'Pre-Marriage Clarity Solutions',
    service_id: 'P2H-H-pre-marriage-clarity-solutions',
    price: 8500,
    category: 'holistic',
    type: 'package',
    is_active: true
  },
  {
    service_name: 'Test Service',
    service_id: 'P2H-MH-test-service',
    price: 11,
    category: 'mental-health',
    type: 'service',
    is_active: true
  }
];

/**
 * Fetch initial service data
 * @returns Array of initial services
 */
export function getInitialServicesData() {
  return initialServices;
}

/**
 * Fetch initial services (Promise version to support catch)
 * @returns Promise that resolves to the initial services
 */
export async function fetchInitialServices(): Promise<any> {
  try {
    // Return a Promise that resolves to the services data
    return Promise.resolve(initialServices);
  } catch (err) {
    console.error('Error initializing services:', err);
    throw err;
  }
}

/**
 * Add initial services to the database
 * @returns The result of the insertion
 */
export async function addInitialServices() {
  console.log('Adding initial services to database');
  
  try {
    const { data, error } = await supabase
      .from('service_pricing')
      .insert(initialServices);
    
    if (error) {
      console.error('Error adding initial services:', error);
      throw error;
    }
    
    console.log('Initial services added successfully');
    return data;
  } catch (error) {
    console.error('Failed to add initial services:', error);
    throw error;
  }
}

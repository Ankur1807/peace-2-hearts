
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches and initializes service data if none exists
 */
export const fetchInitialServices = async () => {
  console.log('Fetching initial service data');
  try {
    // First check if we already have services in the database
    const { data, error } = await supabase
      .from('service_pricing')
      .select('*');  // Use * instead of count(*) to avoid type issues

    if (error) {
      console.error('Error checking for services:', error);
      throw error;
    }

    // If we have services, just return
    if (data && data.length > 0) {
      console.log(`Found ${data.length} existing services, no need to initialize`);
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

/**
 * Adds initial services to the database
 * This is a fallback method used by the usePricingServices hook
 */
export const addInitialServices = async () => {
  try {
    await fetchInitialServices();
    return true;
  } catch (error) {
    console.error('Failed to add initial services:', error);
    return false;
  }
};

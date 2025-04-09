
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
        service_id: "Mental-Health-Counselling",
        price: 2500,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Family Therapy",
        service_id: "Family-Therapy",
        price: 3000,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Couples Counselling",
        service_id: "Couples-Counselling",
        price: 3000,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Premarital Counselling",
        service_id: "Premarital-Counselling",
        price: 2500,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Sexual Health Counselling",
        service_id: "Sexual-Health-Counselling",
        price: 2800,
        category: "mental-health",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "General Legal Consultation",
        service_id: "General-Legal-Consultation",
        price: 2000, 
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Divorce Consultation",
        service_id: "Divorce-Consultation",
        price: 3500,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Child Custody Consultation",
        service_id: "Child-Custody-Consultation",
        price: 3500,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Mediation Services",
        service_id: "Mediation-Services",
        price: 4000,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Pre-Marriage Legal Consultation",
        service_id: "Pre-Marriage-Legal-Consultation",
        price: 2500,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Maintenance Consultation",
        service_id: "Maintenance-Consultation",
        price: 3000,
        category: "legal",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Divorce Prevention Package",
        service_id: "Divorce-Prevention-Package",
        price: 10000,
        category: "holistic",
        currency: "INR",
        is_active: true,
        scenario: "regular"
      },
      {
        service_name: "Pre-Marriage Clarity Package",
        service_id: "Pre-Marriage-Package",
        price: 6000,
        category: "holistic",
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

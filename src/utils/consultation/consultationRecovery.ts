
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { generateReferenceId } from "@/utils/referenceGenerator";
import { determineServiceCategory } from "../payment/services/serviceUtils";

/**
 * Fetch consultation data by reference ID
 */
export async function fetchConsultationData(referenceId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
      
    if (error) {
      console.error("Error fetching consultation data:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching consultation data:", error);
    return null;
  }
}

/**
 * Create booking details object from consultation data
 */
export function createBookingDetailsFromConsultation(consultationData: any): BookingDetails | null {
  try {
    if (!consultationData) return null;
    
    return {
      clientName: consultationData.client_name || 'Client',
      email: consultationData.client_email || '',
      referenceId: consultationData.reference_id,
      consultationType: consultationData.consultation_type,
      services: consultationData.consultation_type.split(','),
      date: consultationData.date,
      timeSlot: consultationData.time_slot,
      timeframe: consultationData.timeframe,
      message: consultationData.message,
      serviceCategory: determineServiceCategory(consultationData.consultation_type),
      amount: consultationData.amount
    };
  } catch (error) {
    console.error("Error creating booking details from consultation:", error);
    return null;
  }
}

/**
 * Create a consultation from booking details
 */
export async function createConsultationFromBookingDetails(bookingDetails: BookingDetails): Promise<any | null> {
  try {
    console.log("Creating consultation from booking details:", bookingDetails);
    
    // Generate reference ID if not provided
    const referenceId = bookingDetails.referenceId || generateReferenceId();
    
    // Ensure date is a string for Supabase
    const dateString = bookingDetails.date ? 
      (typeof bookingDetails.date === 'object' && bookingDetails.date instanceof Date) ?
        bookingDetails.date.toISOString() : String(bookingDetails.date) : 
      null;
    
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        reference_id: referenceId,
        client_name: bookingDetails.clientName,
        client_email: bookingDetails.email,
        client_phone: bookingDetails.phone || '',
        consultation_type: bookingDetails.consultationType,
        date: dateString,
        time_slot: bookingDetails.timeSlot || '',
        timeframe: bookingDetails.timeframe || '',
        message: bookingDetails.message || '',
        status: 'created'
      })
      .select();
    
    if (error) {
      console.error("Error creating consultation:", error);
      return null;
    }
    
    console.log("Consultation created:", data);
    return data[0];
  } catch (error) {
    console.error("Exception creating consultation:", error);
    return null;
  }
}

/**
 * Create a recovery consultation for orphaned payments
 */
export async function createRecoveryConsultation(
  referenceId: string, 
  paymentId: string, 
  amount: number,
  bookingDetails?: any
): Promise<boolean> {
  try {
    console.log("Attempting to create a recovery consultation record");
    
    const clientName = bookingDetails?.clientName || 'Payment Received - Recovery Needed';
    const clientEmail = bookingDetails?.email || null;
    const consultationType = bookingDetails?.consultationType || 'recovery_needed';
    let message = `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`;
    
    if (bookingDetails) {
      message += `. Additional details: ${JSON.stringify(bookingDetails)}`;
    }
    
    const { data: recoveryData, error: recoveryError } = await supabase
      .from('consultations')
      .insert({
        reference_id: referenceId,
        status: 'payment_received_needs_details',
        consultation_type: consultationType,
        time_slot: bookingDetails?.timeSlot || 'recovery_needed',
        timeframe: bookingDetails?.timeframe || null,
        client_name: clientName,
        client_email: clientEmail,
        message: message,
        payment_id: paymentId,
        amount: amount,
        payment_status: 'completed'
      })
      .select();
      
    if (recoveryError) {
      console.error("Failed to create recovery consultation:", recoveryError);
      return false;
    } 
    
    if (recoveryData) {
      console.log("Created recovery consultation:", recoveryData);
      return true;
    }
    
    return false;
  } catch (recoveryException) {
    console.error("Exception in recovery process:", recoveryException);
    return false;
  }
}

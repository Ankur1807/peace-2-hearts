/**
 * Utility functions for Razorpay integration
 */
import { supabase } from "@/integrations/supabase/client";
import { CreateOrderParams, OrderResponse, VerifyPaymentParams } from "./razorpayTypes";
import { loadRazorpayScript, isRazorpayAvailable } from "./razorpayLoader";
import { BookingDetails } from "@/utils/types";
import { sendBookingConfirmationEmail } from "@/utils/emailService";

/**
 * Create a new Razorpay order
 */
export const createRazorpayOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = params;
    
    console.log("Creating Razorpay order with params:", { 
      amount, 
      currency, 
      receipt, 
      notes
    });
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'create_order',
        amount,
        currency,
        receipt,
        orderData: { notes }
      })
    });
    
    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
    
    console.log("Razorpay order response:", data);
    return data as OrderResponse;
  } catch (err) {
    console.error('Exception creating order:', err);
    return { 
      success: false, 
      error: 'Failed to create order',
      details: err instanceof Error ? { 
        id: 'error', 
        amount: 0, 
        currency: 'INR', 
        message: err.message 
      } : { 
        id: 'error', 
        amount: 0, 
        currency: 'INR', 
        message: String(err) 
      }
    };
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyRazorpayPayment = async (params: VerifyPaymentParams): Promise<boolean> => {
  try {
    const { paymentId, orderId, signature } = params;
    
    console.log("Verifying Razorpay payment:", { paymentId, orderId, signature: signature ? "provided" : "missing" });
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'verify_payment',
        paymentId,
        orderData: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        }
      })
    });
    
    if (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
    
    console.log("Payment verification response from Razorpay:", data);
    
    return data?.success === true && data?.verified === true;
  } catch (err) {
    console.error('Exception verifying payment:', err);
    return false;
  }
};

/**
 * Save payment record to database with retry mechanism and transaction support
 */
export const savePaymentRecord = async (params: {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
}): Promise<boolean> => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      const { paymentId, orderId, amount, referenceId, status = 'completed' } = params;
      
      console.log(`Saving payment record (attempt ${retryCount + 1}):`, { 
        paymentId, 
        orderId, 
        amount, 
        referenceId,
        status 
      });

      // First, find the consultation by reference ID
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('id, reference_id, client_name, client_email, date, time_slot, timeframe, consultation_type, message')
        .eq('reference_id', referenceId)
        .single();
      
      if (consultationError) {
        console.error(`Attempt ${retryCount + 1}: Error finding consultation:`, consultationError);
        console.log(`Detailed error response:`, JSON.stringify(consultationError));
        
        // Log the specific consultation we're trying to find
        console.log(`Searching for consultation with reference ID: "${referenceId}"`);
        
        // If the consultation is not found, check if there are any consultations in the database
        const { data: allConsultations, error: checkError } = await supabase
          .from('consultations')
          .select('id, reference_id, client_name')
          .limit(5);
          
        if (!checkError && allConsultations) {
          console.log(`Recent consultations in database:`, allConsultations);
        }
        
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return false;
      }
      
      if (!consultationData) {
        console.error(`Attempt ${retryCount + 1}: No consultation found for reference ID: ${referenceId}`);
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        return false;
      }

      const consultationId = consultationData.id;
      console.log(`Found consultation ID ${consultationId} for payment record with reference ID: ${referenceId}`);

      // Check if payment record already exists for this consultation
      const { data: existingPayment, error: checkPaymentError } = await supabase
        .from('payments')
        .select('id, transaction_id')
        .eq('consultation_id', consultationId)
        .eq('transaction_id', paymentId)
        .maybeSingle();
        
      if (checkPaymentError) {
        console.error('Error checking existing payment:', checkPaymentError);
      }
      
      if (existingPayment) {
        console.log(`Payment record already exists for this consultation and transaction: ${existingPayment.id}`);
        
        // Update consultation status if needed
        await updateConsultationStatus(consultationId, status);
        
        // Send confirmation email - even if payment record exists, make sure email is sent
        await sendEmailForConsultation(consultationData);
        
        return true;
      }

      // Begin transaction for better atomicity
      // Save the payment record and update consultation status together
      const { data, error } = await supabase.rpc('create_payment_and_update_consultation', {
        p_consultation_id: consultationId,
        p_amount: amount,
        p_transaction_id: paymentId,
        p_payment_status: status,
        p_payment_method: 'razorpay',
        p_order_id: orderId
      });

      if (error) {
        console.error(`Attempt ${retryCount + 1}: Error in transaction:`, error);
        
        // Fallback to non-transactional approach if RPC fails
        console.log("Falling back to non-transactional approach...");
        
        // Save the payment record
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .insert({
            consultation_id: consultationId,
            amount: amount,
            transaction_id: paymentId,
            order_id: orderId, // Make sure we store the order_id
            payment_status: status,
            payment_method: 'razorpay',
          })
          .select();
        
        if (paymentError) {
          console.error(`Attempt ${retryCount + 1}: Error saving payment record:`, paymentError);
          retryCount++;
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return false;
        }

        console.log("Payment record inserted successfully:", paymentData);

        // Update consultation status to paid
        const updated = await updateConsultationStatus(consultationId, status);
        if (!updated) {
          console.warn("Payment record saved but consultation status update failed");
        }
      } else {
        console.log("Transaction completed successfully:", data);
      }

      // Send confirmation email after successful payment record creation
      await sendEmailForConsultation(consultationData);
      
      return true;
    } catch (err) {
      console.error(`Attempt ${retryCount + 1}: Exception saving payment record:`, err);
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in 1 second... (${retryCount}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      return false;
    }
  }
  
  return false;
};

/**
 * Helper function to send confirmation email for a consultation
 */
const sendEmailForConsultation = async (consultationData: any): Promise<boolean> => {
  try {
    if (!consultationData.client_email) {
      console.error("Cannot send confirmation email - missing email address");
      return false;
    }

    console.log(`Attempting to send confirmation email for consultation: ${consultationData.reference_id}`);
    
    // Format booking details for email
    const bookingDetails = {
      clientName: consultationData.client_name || '',
      email: consultationData.client_email || '',
      referenceId: consultationData.reference_id || '',
      consultationType: consultationData.consultation_type || '',
      services: [consultationData.consultation_type || ''],
      date: consultationData.date ? new Date(consultationData.date) : undefined,
      timeSlot: consultationData.time_slot || undefined,
      timeframe: consultationData.timeframe || undefined,
      message: consultationData.message || '',
      serviceCategory: determineServiceCategory(consultationData.consultation_type)
    };
    
    console.log("Sending booking confirmation email with details:", bookingDetails);
    
    const result = await sendBookingConfirmationEmail(bookingDetails);
    
    console.log("Email sending result:", result);
    return result;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};

/**
 * Helper function to determine service category from consultation type
 */
const determineServiceCategory = (consultationType: string): string => {
  if (!consultationType) return '';
  
  if (consultationType.includes('holistic') || 
      consultationType.includes('divorce-prevention') || 
      consultationType.includes('pre-marriage-clarity')) {
    return 'holistic';
  }
  
  if (consultationType.includes('legal') || 
      consultationType.includes('divorce') || 
      consultationType.includes('custody')) {
    return 'legal';
  }
  
  if (consultationType.includes('psychological') || 
      consultationType.includes('therapy') || 
      consultationType.includes('counseling')) {
    return 'psychological';
  }
  
  if (consultationType.includes('test')) {
    return 'test';
  }
  
  return '';
};

/**
 * Helper function to update consultation status
 */
const updateConsultationStatus = async (consultationId: string, status: string): Promise<boolean> => {
  try {
    console.log(`Updating consultation ${consultationId} status to: ${status}`);
    
    const { error } = await supabase
      .from('consultations')
      .update({ status: status === 'completed' ? 'paid' : status })
      .eq('id', consultationId);
    
    if (error) {
      console.error('Error updating consultation status:', error);
      return false;
    }
    
    console.log(`Consultation ${consultationId} status updated to: ${status}`);
    return true;
  } catch (err) {
    console.error('Exception updating consultation status:', err);
    return false;
  }
};

/**
 * Complete the booking after payment
 */
export const completeBookingAfterPayment = async (
  referenceId: string, 
  bookingDetails: BookingDetails,
  paymentId: string,
  amount: number
): Promise<boolean> => {
  try {
    console.log("Completing booking after payment:", { referenceId, paymentId, amount });
    
    // Save the payment record
    await savePaymentRecord({
      paymentId,
      orderId: '', // We might not have this at this point
      amount,
      referenceId,
    });
    
    return true;
  } catch (err) {
    console.error('Exception completing booking after payment:', err);
    return false;
  }
};

/**
 * Verify payment by ID
 */
export const verifyAndSyncPayment = async (paymentId: string): Promise<boolean> => {
  try {
    console.log("Verifying payment by ID:", paymentId);
    
    // Check payment status in Razorpay
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'verify_payment',
        paymentId,
        checkOnly: true
      })
    });
    
    if (error || !data?.success) {
      console.error('Error verifying payment by ID:', error || data?.error);
      return false;
    }
    
    return data.verified || false;
  } catch (err) {
    console.error('Exception in verifyAndSyncPayment:', err);
    return false;
  }
};

// Re-export script loading utilities
export { loadRazorpayScript, isRazorpayAvailable };

// Re-export types for compatibility with existing code
export type { CreateOrderParams, OrderResponse, VerifyPaymentParams } from './razorpayTypes';

/**
 * Attempt to recover payment records for consultations that have no payment record
 * This can be called after payment to ensure we don't miss any confirmation emails
 */
export const recoverPaymentRecord = async (referenceId: string, paymentId: string, amount: number, orderId?: string): Promise<boolean> => {
  try {
    console.log(`Attempting to recover payment record for consultation ${referenceId} with payment ${paymentId}`);
    
    // Step 1: Verify the payment exists and is valid with Razorpay
    const paymentVerified = await verifyAndSyncPayment(paymentId);
    
    if (!paymentVerified) {
      console.error(`Payment ${paymentId} couldn't be verified with Razorpay`);
      return false;
    }
    
    console.log(`Payment ${paymentId} verified successfully with Razorpay`);
    
    // Step 2: Create payment record and update consultation status
    const paymentSaved = await savePaymentRecord({
      paymentId,
      orderId: orderId || '',
      amount,
      referenceId,
      status: 'completed'
    });
    
    return paymentSaved;
  } catch (error) {
    console.error(`Error recovering payment record for ${referenceId}:`, error);
    return false;
  }
};

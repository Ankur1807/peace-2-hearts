
import { generateReferenceId } from "./referenceGenerator";
import { PersonalDetails } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const saveConsultation = async (
  consultationType: string,
  date: Date | undefined,
  timeSlotOrTimeframe: string,
  personalDetails: PersonalDetails
) => {
  // For holistic packages, we use timeframe instead of specific date
  const isTimeframe = ['1-2-weeks', '2-4-weeks', '4-weeks-plus'].includes(timeSlotOrTimeframe);
  
  console.log("saveConsultation called with:", { 
    consultationType, 
    date: date?.toISOString() || 'Using timeframe instead', 
    timeSlotOrTimeframe, 
    isTimeframe,
    personalDetails 
  });

  try {
    // Create a reference ID for the consultation
    const referenceId = generateReferenceId();
    console.log("Generated reference ID:", referenceId);

    // Prepare the consultation data
    const consultationData = {
      consultation_type: consultationType,
      date: date ? date.toISOString() : null,
      time_slot: isTimeframe ? null : timeSlotOrTimeframe,
      timeframe: isTimeframe ? timeSlotOrTimeframe : null,
      client_name: `${personalDetails.firstName} ${personalDetails.lastName}`,
      client_email: personalDetails.email,
      client_phone: personalDetails.phone,
      status: 'scheduled', // Initially set to scheduled, will be updated to 'paid' after payment
      message: personalDetails.message,
      reference_id: referenceId,
      source: 'frontend' // Mark the source as frontend
    };
    
    console.log("Checking for existing consultation with reference ID:", referenceId);
    
    // Check if consultation record already exists
    const { data: existingConsultation, error: checkError } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing consultation:", checkError);
      throw checkError;
    }
    
    if (existingConsultation) {
      console.log("Consultation record already exists for reference ID:", referenceId);
      // Return the existing record data
      return { ...existingConsultation, referenceId };
    }
    
    console.log("No existing consultation found, creating new record with source 'frontend'");
    
    // Insert the consultation into Supabase with retry mechanism
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const { data, error } = await supabase
          .from('consultations')
          .insert(consultationData)
          .select();
        
        if (error) {
          console.error(`Attempt ${attempts + 1}: Error inserting consultation:`, error);
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`Retrying in 1 second... (${attempts}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.error(`Attempt ${attempts + 1}: No data returned after inserting consultation`);
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`Retrying in 1 second... (${attempts}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw new Error("Failed to save consultation: No data returned");
        }
        
        console.log("Consultation saved successfully to Supabase:", data);
        
        // Verify the consultation was actually saved by querying it back
        const { data: verificationData, error: verificationError } = await supabase
          .from('consultations')
          .select('*')
          .eq('reference_id', referenceId)
          .single();
          
        if (verificationError || !verificationData) {
          console.error("Verification failed - consultation may not have been saved:", verificationError);
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`Retrying in 1 second... (${attempts}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          throw new Error("Failed to verify consultation was saved");
        }
        
        console.log("Consultation verified in database:", verificationData);
        return { ...data[0], referenceId };
      } catch (retryError) {
        console.error(`Attempt ${attempts + 1}: Error in retry loop:`, retryError);
        attempts++;
        if (attempts >= maxAttempts) {
          throw retryError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw new Error("Failed to save consultation after multiple attempts");
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    // Log additional information about the connection
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('consultations')
        .select('count(*)')
        .limit(1);
        
      if (connectionError) {
        console.error("Database connection test failed:", connectionError);
      } else {
        console.log("Database connection test succeeded:", connectionTest);
      }
    } catch (testError) {
      console.error("Error testing database connection:", testError);
    }
    
    throw error;
  }
};

// Update a consultation record (e.g., after payment)
export const updateConsultationStatus = async (
  referenceId: string,
  newStatus: string
) => {
  try {
    console.log(`Updating consultation ${referenceId} to status ${newStatus}`);
    
    const { data, error } = await supabase
      .from('consultations')
      .update({ status: newStatus })
      .eq('reference_id', referenceId)
      .select();
    
    if (error) {
      console.error("Error updating consultation status:", error);
      return false;
    }
    
    console.log("Consultation status updated successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in updateConsultationStatus:", error);
    return false;
  }
};

// Get consultation details by reference ID
export const getConsultationByReferenceId = async (referenceId: string) => {
  try {
    console.log("Fetching consultation with reference ID:", referenceId);
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation by reference ID:", error);
      return null;
    }
    
    console.log("Consultation data retrieved:", data);
    return data;
  } catch (error) {
    console.error("Error in getConsultationByReferenceId:", error);
    return null;
  }
};

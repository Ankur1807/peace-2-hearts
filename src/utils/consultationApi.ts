
import { generateReferenceId } from "./referenceGenerator";
import { PersonalDetails } from "./types";

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

    // Since we're removing Supabase, we'll simulate saving the consultation
    // In a real implementation, you would integrate with a database service here
    
    // Simulate a successful creation with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a mock consultation response
    const consultation = {
      id: crypto.randomUUID(),
      consultationType,
      date: date ? date.toISOString() : null,
      timeSlot: isTimeframe ? null : timeSlotOrTimeframe,
      timeframe: isTimeframe ? timeSlotOrTimeframe : null,
      clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
      clientEmail: personalDetails.email,
      clientPhone: personalDetails.phone,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      message: personalDetails.message,
      referenceId
    };
    
    console.log("Consultation saved successfully:", consultation);
    
    return { ...consultation, referenceId };
  } catch (error) {
    console.error("Error in saveConsultation:", error);
    throw error;
  }
};

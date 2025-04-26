
/**
 * Generate a unique reference ID for a consultation booking
 * Format: P2H-TIMESTAMP-RANDOM
 */
export const generateReferenceId = (): string => {
  const prefix = 'P2H';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  console.log(`Generated reference ID: ${prefix}-${timestamp}-${random}`);
  return `${prefix}-${timestamp}-${random}`;
};

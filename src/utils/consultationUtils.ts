
// Re-export everything from the new modular files
export * from './types';
export * from './bookingStorage';
export * from './formatUtils';
export * from './consultationLabels';
export * from './referenceGenerator';
// Import and re-export saveConsultation from consultationApi
export { saveConsultation } from './consultationApi';

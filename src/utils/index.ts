
// Main utils exports
export * from './dateFormatters';
export * from './formatUtils';
export * from './types';
export * from './email';
export * from './consultation/packageUtils';

// Add manual recovery function to global exports
import { recoverEmailByReferenceId } from './email/manualEmailRecovery';

// Make it available globally
if (typeof window !== 'undefined') {
  // @ts-ignore - Window extension
  window.recoverEmailByReferenceId = recoverEmailByReferenceId;
}

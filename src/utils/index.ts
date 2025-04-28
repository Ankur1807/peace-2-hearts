
// Main utils exports
export * from './dateFormatters';
// Export from formatUtils but avoid collisions with dateFormatters
import * as formatUtils from './formatUtils';
export {
  // Re-export everything except formatDate which would conflict with dateFormatters
  formatUtils
};

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

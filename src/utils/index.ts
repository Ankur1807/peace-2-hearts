
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

// No longer adding recovery functions to window object globally
// This is now handled in consoleRecovery.ts only on payment-related pages

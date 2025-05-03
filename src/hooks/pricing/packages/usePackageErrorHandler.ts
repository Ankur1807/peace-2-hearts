
import { ToastFunction } from '../types';

export const usePackageErrorHandler = () => {
  const handleError = (error: any, operation: string) => {
    console.error(`Error details for ${operation}:`, error);
    
    // Convert error to a more useful format for display
    let errorMessage = "Unknown error occurred";
    
    if (typeof error === 'object') {
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    console.error(`Error: ${operation}: ${errorMessage}`);
    return errorMessage;
  };
  
  return { handleError };
};

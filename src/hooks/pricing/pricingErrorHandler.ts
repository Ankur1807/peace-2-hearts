
import { ToastFunction } from './types';

export const handleOperationError = (error: any, operation: string, toast: ToastFunction) => {
  console.error(`Error details for ${operation}:`, error);
  
  if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
    toast({
      title: `Session Expired - Your admin session has expired. Please log in again.`,
      variant: 'destructive',
    });
    localStorage.removeItem('p2h_admin_authenticated');
  } else if (error.message?.includes('Authentication required')) {
    toast({
      title: `Authentication Required - You must be logged in as an admin to ${operation}.`,
      variant: 'destructive',
    });
  } else {
    toast({
      title: `Error - Failed to ${operation}: ${error.message}`,
      variant: 'destructive',
    });
  }
  console.error(`Error: ${operation}:`, error);
};

export type { ToastFunction };

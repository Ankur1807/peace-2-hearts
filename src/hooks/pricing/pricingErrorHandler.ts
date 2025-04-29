
import { toast } from "@/hooks/use-toast";
import { ToastProps } from "@/components/ui/toast";

export const handleOperationError = (
  error: any, 
  operation: string, 
  toast: { (props: ToastProps): void; }
) => {
  console.error(`Error details for ${operation}:`, error);
  
  if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
    toast({
      title: 'Session Expired',
      description: 'Your admin session has expired. Please log in again.',
      variant: 'destructive',
    });
    localStorage.removeItem('p2h_admin_authenticated');
  } else if (error.message?.includes('Authentication required')) {
    toast({
      title: 'Authentication Required',
      description: `You must be logged in as an admin to ${operation}.`,
      variant: 'destructive',
    });
  } else {
    toast({
      title: 'Error',
      description: `Failed to ${operation}: ${error.message || 'Unknown error occurred'}`,
      variant: 'destructive',
    });
  }
};


import { useToast } from '@/hooks/use-toast';

export const usePackageErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: any, operation: string) => {
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
  };

  return { handleError };
};

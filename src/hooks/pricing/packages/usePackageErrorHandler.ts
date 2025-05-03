
import { useToast } from '@/hooks/use-toast';

export const usePackageErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: any, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
      toast({
        title: 'Session Expired',
        description: 'Your admin session has expired. Please log in again.',
        variant: 'destructive',
      });
      localStorage.removeItem('p2h_admin_authenticated');
    } else {
      toast({
        title: 'Error',
        description: `Failed to ${operation}: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  return { handleError };
};

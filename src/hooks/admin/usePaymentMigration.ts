
import { useState, useCallback } from 'react';
import { verifyPaymentMigration, executePaymentMigration } from '@/utils/payment/services/paymentMigration';
import { useToast } from '@/hooks/use-toast';

export function usePaymentMigration() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationStats, setMigrationStats] = useState<{
    success: boolean;
    migratedConsultations: number;
    consultationsWithoutPayment: number;
  } | null>(null);
  const { toast } = useToast();
  
  const verifyMigration = useCallback(async () => {
    setIsVerifying(true);
    try {
      const results = await verifyPaymentMigration();
      setMigrationStats(results);
      
      toast({
        title: results.success ? "Migration Status Verified" : "Migration Check Failed",
        description: `Found ${results.migratedConsultations} migrated consultations and ${results.consultationsWithoutPayment} consultations without payments.`
      });
      
      return results;
    } catch (error) {
      console.error("Error verifying payment migration:", error);
      toast({
        title: "Migration Check Failed",
        description: "Could not verify payment migration status",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  }, [toast]);
  
  const runMigration = useCallback(async () => {
    setIsMigrating(true);
    try {
      const result = await executePaymentMigration();
      
      toast({
        title: result.success ? "Migration Completed" : "Migration Failed",
        description: result.message
      });
      
      // Verify the migration after running it
      if (result.success) {
        await verifyMigration();
      }
      
      return result;
    } catch (error) {
      console.error("Error running payment migration:", error);
      toast({
        title: "Migration Failed",
        description: "An error occurred during the payment migration",
        variant: "destructive"
      });
      return {
        success: false,
        message: "An error occurred during the payment migration"
      };
    } finally {
      setIsMigrating(false);
    }
  }, [toast, verifyMigration]);
  
  return {
    isVerifying,
    isMigrating,
    migrationStats,
    verifyMigration,
    runMigration
  };
}

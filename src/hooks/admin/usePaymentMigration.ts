
import { useState } from 'react';
import { verifyPaymentMigration, executePaymentMigration } from '@/utils/payment/services/paymentMigration';
import { useToast } from '@/hooks/use-toast';

export function usePaymentMigration() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const verifyMigration = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyPaymentMigration();
      setVerificationResult(result);
      
      if (result.success) {
        toast({
          title: "Verification Complete",
          description: `Found ${result.paymentsCount} payment records and ${result.consultationsWithoutPayment} consultations needing payment data.`
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "Could not verify migration status. See console for details.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error verifying migration:", error);
      setVerificationResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return {
        success: false,
        paymentsCount: 0,
        consultationsWithoutPayment: 0
      };
    } finally {
      setIsVerifying(false);
    }
  };

  const executeMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await executePaymentMigration();
      setMigrationResult(result);
      
      if (result.success) {
        toast({
          title: "Migration Successful",
          description: result.message
        });
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error executing migration:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setMigrationResult({
        success: false,
        message: errorMessage
      });
      
      toast({
        title: "Migration Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsMigrating(false);
    }
  };

  const canExecuteMigration = verificationResult?.success &&
    verificationResult?.paymentsCount === 0 && 
    verificationResult?.consultationsWithoutPayment === 0;

  return {
    isVerifying,
    isMigrating,
    verificationResult,
    migrationResult,
    verifyMigration,
    executeMigration,
    canExecuteMigration
  };
}

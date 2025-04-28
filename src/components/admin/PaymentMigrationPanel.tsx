
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { verifyPaymentMigration, executePaymentMigration } from '@/utils/payment/services/paymentMigration';

const PaymentMigrationPanel: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleVerifyMigration = async () => {
    setIsVerifying(true);
    try {
      const result = await verifyPaymentMigration();
      setVerificationResult(result);
    } catch (error) {
      console.error("Error verifying migration:", error);
      setVerificationResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleExecuteMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await executePaymentMigration();
      setMigrationResult(result);
    } catch (error) {
      console.error("Error executing migration:", error);
      setMigrationResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Payment System Migration</CardTitle>
        <CardDescription>
          Safely migrate from legacy payments table to consolidated consultations table
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verificationResult && (
          <Alert variant={verificationResult.success ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Results</AlertTitle>
            <AlertDescription>
              <div className="mt-2 text-sm">
                <p>Payments records found: {verificationResult.paymentsCount}</p>
                <p>Consultations without payment data: {verificationResult.consultationsWithoutPayment}</p>
                <p className="mt-2 font-medium">
                  Status: {verificationResult.success 
                    ? (verificationResult.paymentsCount === 0 && verificationResult.consultationsWithoutPayment === 0
                      ? "Ready for migration" 
                      : "Migration issues detected")
                    : "Verification failed"}
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {migrationResult && (
          <Alert variant={migrationResult.success ? "default" : "destructive"}>
            {migrationResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{migrationResult.success ? "Success" : "Migration Failed"}</AlertTitle>
            <AlertDescription>{migrationResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button 
            variant="outline" 
            onClick={handleVerifyMigration} 
            disabled={isVerifying || isMigrating}
          >
            {isVerifying ? "Verifying..." : "Verify Migration"}
          </Button>
          <Button 
            onClick={handleExecuteMigration}
            disabled={isMigrating || isVerifying || !verificationResult?.success || 
              verificationResult?.paymentsCount > 0 || verificationResult?.consultationsWithoutPayment > 0}
            variant={verificationResult?.success &&
              verificationResult?.paymentsCount === 0 && 
              verificationResult?.consultationsWithoutPayment === 0 ? "default" : "secondary"}
          >
            {isMigrating ? "Executing..." : "Execute Migration"}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mt-6">
          <p className="font-medium">Migration Process:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Verify that all payment data has been migrated to consultations table</li>
            <li>Check for any consultations that should have payment data but don't</li>
            <li>Only proceed with migration if all checks pass</li>
            <li>Remove legacy payments table and clean up references</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMigrationPanel;


import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface RecoveryMessageProps {
  bookingRecovered: boolean;
  recoveryResult?: { success: boolean; message: string } | null;
  onManualRecovery: () => void;
  referenceId?: string | null;
  paymentId?: string | null;
}

const RecoveryMessage = ({ 
  bookingRecovered, 
  recoveryResult, 
  onManualRecovery,
  referenceId,
  paymentId 
}: RecoveryMessageProps) => {
  const navigate = useNavigate();
  const [isRecovering, setIsRecovering] = useState(false);
  
  const handleRecovery = async () => {
    setIsRecovering(true);
    await onManualRecovery();
    setIsRecovering(false);
  };

  if (bookingRecovered) {
    return (
      <Alert variant="default" className="mb-6 bg-green-50 text-green-800 border-green-200">
        <AlertTitle>Booking Record Recovered</AlertTitle>
        <AlertDescription>
          Your booking record has been successfully recovered.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200">
        <AlertTitle>Booking Details Unavailable</AlertTitle>
        <AlertDescription>
          We couldn't find your complete booking details, but your payment has been recorded. 
          {!recoveryResult && paymentId && referenceId && (
            <p className="mt-2">
              You may not have received a confirmation email yet. Click the button below to resend it.
            </p>
          )}
        </AlertDescription>
      </Alert>
      
      {!recoveryResult && paymentId && referenceId && (
        <Button 
          onClick={handleRecovery} 
          className="mb-6 bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={isRecovering}
        >
          {isRecovering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Resend Confirmation Email"
          )}
        </Button>
      )}
      
      {recoveryResult && (
        <Alert variant={recoveryResult.success ? "default" : "destructive"} className="my-4">
          <AlertTitle>{recoveryResult.success ? "Recovery Successful" : "Recovery Issue"}</AlertTitle>
          <AlertDescription>{recoveryResult.message}</AlertDescription>
        </Alert>
      )}
      
      <div className="pt-2">
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    </div>
  );
};

export default RecoveryMessage;

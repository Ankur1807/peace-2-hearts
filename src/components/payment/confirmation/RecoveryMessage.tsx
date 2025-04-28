
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RecoveryMessageProps {
  bookingRecovered: boolean;
  recoveryResult?: { success: boolean; message: string } | null;
  onManualRecovery: () => void;
}

const RecoveryMessage = ({ bookingRecovered, recoveryResult, onManualRecovery }: RecoveryMessageProps) => {
  const navigate = useNavigate();

  if (bookingRecovered) {
    return (
      <p className="mb-6 text-green-600">
        Your booking record has been successfully recovered.
      </p>
    );
  }

  return (
    <>
      <p className="mb-6 text-amber-600">
        We couldn't find complete booking details, but your payment has been recorded. 
        {!recoveryResult && " You may not have received a confirmation email yet."}
      </p>
      {!recoveryResult && (
        <Button 
          onClick={onManualRecovery} 
          className="mb-6 bg-peacefulBlue hover:bg-peacefulBlue/90"
        >
          Resend Confirmation Email
        </Button>
      )}
      <Button onClick={() => navigate('/')}>Return to Home</Button>
    </>
  );
};

export default RecoveryMessage;

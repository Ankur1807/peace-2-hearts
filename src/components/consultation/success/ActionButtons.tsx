
import { useState } from "react";
import { Link } from "react-router-dom";
import { MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { resendBookingConfirmationEmail } from "@/utils/emailService";
import { BookingDetails } from "@/utils/types";

interface ActionButtonsProps {
  bookingDetails?: BookingDetails;
  referenceId: string;
}

const ActionButtons = ({ bookingDetails, referenceId }: ActionButtonsProps) => {
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!bookingDetails) return;
    
    setResending(true);
    try {
      const success = await resendBookingConfirmationEmail({
        clientName: bookingDetails.clientName,
        email: bookingDetails.email,
        referenceId,
        consultationType: bookingDetails.services[0],
        services: bookingDetails.services,
        date: bookingDetails.date,
        timeSlot: bookingDetails.timeSlot,
        timeframe: bookingDetails.timeframe,
        packageName: bookingDetails.packageName
      });

      if (success) {
        toast({
          title: "Email Sent",
          description: "Your booking confirmation has been resent to your email.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to resend the booking confirmation. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    setResending(false);
  };

  return (
    <>
      {bookingDetails && (
        <div className="mt-6 mb-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleResendEmail}
            disabled={resending}
          >
            <MailIcon className="h-4 w-4" />
            {resending ? "Sending..." : "Resend Confirmation Email"}
          </Button>
        </div>
      )}
      
      <div className="mt-10">
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </>
  );
};

export default ActionButtons;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarPlus, FilePlus, Download, Send, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '@/utils/types';
import { useToast } from '@/hooks/use-toast';
import { sendBookingConfirmationEmail } from '@/utils/emailService';
import { usePaymentRecovery } from '@/hooks/consultation/usePaymentRecovery';

interface ActionButtonsProps {
  bookingDetails?: BookingDetails;
  referenceId: string;
}

const ActionButtons = ({ bookingDetails, referenceId }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { recoverPaymentAndSendEmail, isRecovering } = usePaymentRecovery();

  const handleResendEmail = async () => {
    if (!bookingDetails) {
      toast({
        title: "Missing Information",
        description: "Cannot resend email without booking details",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // First, try using the recovery mechanism if we have payment details
      if (bookingDetails.amount && bookingDetails.amount > 0 && referenceId) {
        const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`) || '';
        const orderId = sessionStorage.getItem(`order_id_${referenceId}`) || '';
        
        if (paymentId) {
          const result = await recoverPaymentAndSendEmail(
            referenceId,
            paymentId,
            bookingDetails.amount,
            orderId
          );
          
          if (result) {
            setEmailSent(true);
            toast({
              title: "Email Sent",
              description: "Confirmation email has been resent successfully",
            });
            setIsSendingEmail(false);
            return;
          }
        }
      }
      
      // Fall back to just sending the email
      const result = await sendBookingConfirmationEmail({
        ...bookingDetails,
        referenceId: referenceId,
        isResend: true,
        highPriority: true // Mark as high priority
      });
      
      if (result) {
        setEmailSent(true);
        toast({
          title: "Email Sent",
          description: "Confirmation email has been resent successfully",
        });
      } else {
        toast({
          title: "Failed to Send Email",
          description: "Please try again or contact support",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-4">
      {!emailSent && !isSendingEmail && !isRecovering && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
          <p className="font-medium">If you haven't received your booking confirmation email:</p>
          <p className="mt-1">Please check your spam folder or click "Send Confirmation Email" below.</p>
        </div>
      )}
      
      {emailSent && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm">
          <p className="font-medium">Email sent!</p>
          <p className="mt-1">Please check your inbox. If you don't see it, check your spam folder.</p>
        </div>
      )}
      
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-between">
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button 
            onClick={() => navigate('/book-consultation')} 
            variant="outline" 
            className="flex items-center"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book Another Session
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleResendEmail}
            disabled={isSendingEmail || isRecovering || !bookingDetails?.email}
          >
            {isSendingEmail || isRecovering ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : emailSent ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Again
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Confirmation Email
              </>
            )}
          </Button>
        </div>
        
        <Button
          onClick={() => navigate('/')}
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;

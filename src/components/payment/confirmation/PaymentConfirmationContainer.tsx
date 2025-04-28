
import React from 'react';
import { Card } from "@/components/ui/card";
import PaymentStatusMessage from './PaymentStatusMessage';
import PaymentInformation from './PaymentInformation';
import RecoveryMessage from './RecoveryMessage';
import { BookingDetails } from "@/utils/types";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";

interface PaymentConfirmationContainerProps {
  verificationResult: { success: boolean; message: string } | null;
  paymentId: string | null;
  orderId: string | null;
  amount: number;
  referenceId: string | null;
  bookingDetails?: BookingDetails;
  bookingRecovered: boolean;
  recoveryResult: { success: boolean; message: string } | null;
  onManualRecovery: () => void;
}

const PaymentConfirmationContainer = ({
  verificationResult,
  paymentId,
  orderId,
  amount,
  referenceId,
  bookingDetails,
  bookingRecovered,
  recoveryResult,
  onManualRecovery
}: PaymentConfirmationContainerProps) => {
  if (!verificationResult) return null;

  return (
    <Card className="p-8 mb-6">
      <PaymentStatusMessage 
        success={verificationResult.success}
        message={verificationResult.message}
        paymentId={paymentId}
        orderId={orderId}
      />
      
      {verificationResult.success && (
        <div className="space-y-6">
          {paymentId && referenceId && (
            <PaymentInformation
              paymentId={paymentId}
              orderId={orderId}
              amount={amount}
              referenceId={referenceId}
            />
          )}
          
          {recoveryResult && (
            <Alert variant={recoveryResult.success ? "default" : "destructive"} className="my-4">
              <AlertTitle>{recoveryResult.success ? "Recovery Successful" : "Recovery Issue"}</AlertTitle>
              <AlertDescription>{recoveryResult.message}</AlertDescription>
            </Alert>
          )}
          
          {bookingDetails ? (
            <BookingSuccessView
              referenceId={referenceId}
              bookingDetails={bookingDetails}
            />
          ) : (
            <div className="text-center py-6">
              <p className="mb-4">Your payment has been successfully processed.</p>
              <RecoveryMessage
                bookingRecovered={bookingRecovered}
                recoveryResult={recoveryResult}
                onManualRecovery={onManualRecovery}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PaymentConfirmationContainer;

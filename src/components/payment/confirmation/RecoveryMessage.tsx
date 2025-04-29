
import React from 'react';
import { Button } from "@/components/ui/button";

interface RecoveryMessageProps {
  bookingRecovered: boolean;
  recoveryResult: { success: boolean; message: string } | null;
  onManualRecovery: () => void;
  referenceId: string | null;
  paymentId: string | null;
}

const RecoveryMessage = ({
  bookingRecovered,
  recoveryResult,
  onManualRecovery,
  referenceId,
  paymentId
}: RecoveryMessageProps) => {
  if (bookingRecovered) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <p className="text-green-700">
          Your booking information has been recovered successfully. You will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  if (recoveryResult) {
    return (
      <div className={`border rounded-lg p-4 mt-4 ${recoveryResult.success ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <p className={recoveryResult.success ? 'text-green-700' : 'text-amber-700'}>
          {recoveryResult.message}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
      <p className="text-amber-700 mb-4">
        We couldn't find your complete booking details, but your payment has been recorded successfully. Our team will contact you shortly.
      </p>
      {(referenceId || paymentId) && (
        <Button onClick={onManualRecovery} variant="outline" size="sm" className="w-full md:w-auto">
          Recover My Booking
        </Button>
      )}
    </div>
  );
};

export default RecoveryMessage;

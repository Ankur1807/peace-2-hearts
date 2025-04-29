
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookingDetails } from '@/utils/types';
import { useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';

interface ActionButtonsProps {
  bookingDetails?: BookingDetails;
  referenceId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  bookingDetails,
  referenceId
}) => {
  const navigate = useNavigate();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Peace2Hearts Consultation Booking',
        text: `I've booked a consultation with Peace2Hearts. My reference ID is ${referenceId}.`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        navigator.clipboard.writeText(
          `I've booked a consultation with Peace2Hearts. My reference ID is ${referenceId}.`
        );
        alert('Booking details copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
      <Button
        variant="default"
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        onClick={() => navigate('/')}
      >
        Return to Home
      </Button>
      
      <Button
        variant="outline"
        className="border-peacefulBlue text-peacefulBlue hover:bg-peacefulBlue/10"
        onClick={handleShare}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Booking
      </Button>
    </div>
  );
};

export default ActionButtons;

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, Shield } from 'lucide-react';
import { getConsultationTypeLabel, getConsultationPrice } from '@/utils/consultationLabels';
import { formatCardNumber, formatExpiryDate } from '@/utils/formatUtils';

type PaymentStepProps = {
  consultationType: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
};

const PaymentStep = ({
  consultationType,
  onNextStep,
  onPrevStep,
  onSubmit,
  isProcessing
}: PaymentStepProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpiryDate(formatExpiryDate(value));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-lora font-semibold mb-6">Payment Information</h2>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">
              {getConsultationTypeLabel(consultationType)}
            </h3>
            <p className="text-sm text-gray-600">60-minute consultation</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">
              {getConsultationPrice(consultationType)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{getConsultationPrice(consultationType)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="card-name">Cardholder Name</Label>
          <Input 
            id="card-name" 
            placeholder="John Doe" 
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <div className="relative">
            <Input 
              id="card-number" 
              placeholder="1234 5678 9012 3456" 
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              required 
            />
            <CreditCard className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY" 
              value={expiryDate}
              onChange={handleExpiryDateChange}
              maxLength={5}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv" 
              placeholder="123" 
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              maxLength={3}
              required 
            />
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Shield className="h-5 w-5 text-gray-500 mr-3" />
          <p className="text-sm text-gray-600">
            All payment information is encrypted and secure. Your card details are never stored on our servers.
          </p>
        </div>
      </div>
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;

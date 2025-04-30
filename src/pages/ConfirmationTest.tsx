
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ConfirmationTest = () => {
  const navigate = useNavigate();

  // Create mock booking details that matches our test reference ID
  const mockBookingDetails: BookingDetails = {
    referenceId: "P2H-TEST-123",
    clientName: "Test User",
    email: "test@example.com",
    phone: "9876543210",
    consultationType: "mental-health-counselling",
    services: ["Mental Health Counselling", "Couples Counselling"],
    date: new Date("2025-05-20T12:00:00.000Z"),
    timeSlot: "11:00-12:00",
    serviceCategory: "mental-health",
    message: "This is a simulated booking for testing purposes",
    amount: 999,
    timeframe: "Morning"
  };

  const simulateSuccessfulBooking = () => {
    // Navigate to payment confirmation page with the mock data in location state
    navigate('/payment-confirmation', {
      state: {
        referenceId: "P2H-TEST-123",
        bookingDetails: mockBookingDetails,
        paymentId: "test_payment_123",
        orderId: "test_order_123",
        amount: 999,
      }
    });
  };

  const simulateReferenceIdOnly = () => {
    // Navigate with only reference ID to test data fetching
    navigate('/payment-confirmation', {
      state: {
        referenceId: "P2H-TEST-123",
      }
    });
  };

  const simulatePaymentVerificationSuccess = () => {
    // Navigate to payment verification with success state
    navigate('/payment-verification', {
      state: {
        referenceId: "P2H-TEST-123",
        bookingDetails: mockBookingDetails,
        paymentId: "test_payment_123",
        orderId: "test_order_123",
        amount: 999,
        isVerifying: false
      }
    });
  };

  const simulateThankYouPage = () => {
    // Navigate to thank you page with success state
    navigate('/thank-you', {
      state: {
        referenceId: "P2H-TEST-123",
        bookingDetails: mockBookingDetails,
        paymentId: "test_payment_123",
        orderId: "test_order_123",
        amount: 999,
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Confirmation Test Utility</h1>
      
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Options for Reference ID: P2H-TEST-123</h2>
        <div className="space-y-4">
          <div>
            <Button 
              onClick={simulateSuccessfulBooking}
              className="w-full"
            >
              Test Confirmation Page with Full Data
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Simulates navigation to /payment-confirmation with complete booking and payment data
            </p>
          </div>
          
          <div>
            <Button 
              onClick={simulateReferenceIdOnly}
              className="w-full"
              variant="outline"
            >
              Test Confirmation with Reference ID Only
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Tests the auto-recovery functionality when only reference ID is available
            </p>
          </div>
          
          <div>
            <Button 
              onClick={simulatePaymentVerificationSuccess}
              className="w-full"
              variant="outline"
            >
              Test Payment Verification Success
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Simulates successful payment verification
            </p>
          </div>
          
          <div>
            <Button 
              onClick={simulateThankYouPage}
              className="w-full"
              variant="outline"
            >
              Test Thank You Page
            </Button>
            <p className="text-sm text-gray-500 mt-1">
              Simulates successful navigation to thank you page
            </p>
          </div>
        </div>
      </Card>
      
      <div className="text-center text-sm text-gray-500">
        <p>This is a testing utility that doesn't modify any permanent UI or routes.</p>
        <p>It only simulates the state for testing the confirmation flow.</p>
      </div>
    </div>
  );
};

export default ConfirmationTest;

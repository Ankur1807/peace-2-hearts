
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RazorpayCard = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Check if Razorpay script is loaded
  React.useEffect(() => {
    const isRazorpayAvailable = typeof window !== 'undefined' && 
                               typeof (window as any).Razorpay !== 'undefined';
    
    setIsLoaded(isRazorpayAvailable);
    
    // If not loaded, we'll assume it will load via the Script component elsewhere
    if (!isRazorpayAvailable) {
      const checkRazorpay = setInterval(() => {
        if (typeof (window as any).Razorpay !== 'undefined') {
          setIsLoaded(true);
          clearInterval(checkRazorpay);
        }
      }, 1000);
      
      // Clear interval after 10 seconds if still not loaded
      setTimeout(() => {
        if (!isLoaded) {
          clearInterval(checkRazorpay);
          setHasError(true);
        }
      }, 10000);
      
      return () => clearInterval(checkRazorpay);
    }
  }, [isLoaded]);

  return (
    <Card className="border border-gray-200 overflow-hidden mb-6">
      <CardContent className="p-4 bg-gradient-to-b from-white to-gray-50">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold mb-0">Secure Payment via Razorpay</h3>
          
          <div className="flex justify-center w-full py-2">
            <img 
              src="https://cdn.razorpay.com/static/assets/merchant-badge/badge-light.png"
              alt="Razorpay secured payment"
              className="h-10 object-contain"
            />
          </div>
          
          <div className="text-sm text-gray-500 text-center">
            <p>All transactions are secure and encrypted.</p>
            <p>You will be redirected to Razorpay to complete your payment.</p>
          </div>
          
          {hasError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was an issue loading the payment gateway. Please refresh the page or try again later.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayCard;

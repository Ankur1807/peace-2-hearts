
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';

const CancellationRefund = () => {
  return (
    <>
      <SEO 
        title="Cancellation and Refund Policy" 
        description="Peace2Hearts Cancellation and Refund Policy - Learn about our cancellation terms and refund process for consultations."
        keywords="cancellation policy, refund policy, consultation cancellation, Peace2Hearts"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-lora font-semibold mb-8">Cancellation and Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Consultation Cancellation Policy</h2>
            <p>We understand that circumstances may arise that could prevent you from attending your scheduled consultation. Our cancellation policy is designed to be fair and reasonable for all parties involved.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Cancellation Timeframes:</h3>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li><strong>More than 24 hours before consultation:</strong> Full refund or reschedule option available.</li>
              <li><strong>Less than 24 hours but more than 4 hours before consultation:</strong> 50% refund or reschedule option available.</li>
              <li><strong>Less than 4 hours before consultation:</strong> No refund available, but one-time reschedule option may be offered at our discretion.</li>
              <li><strong>No-shows:</strong> No refund or reschedule option will be provided.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">How to Cancel:</h3>
            <p>To cancel or reschedule your consultation, please contact us via:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Email: <a href="mailto:bookings@peace2hearts.com" className="text-peacefulBlue hover:underline">bookings@peace2hearts.com</a></li>
              <li>Phone: +91 7428564364 (during business hours)</li>
            </ul>
            <p>Please include your name, booking reference number, and scheduled consultation date/time.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Refund Policy</h2>
            <p>If you are eligible for a refund as per our cancellation policy, the following terms apply:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Refund Processing:</h3>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Refunds will be processed using the same payment method used for the original transaction.</li>
              <li>Processing time for refunds is typically 7-14 business days, depending on your payment provider.</li>
              <li>Transaction fees charged by payment processors are non-refundable.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Special Circumstances:</h3>
            <p>We understand that exceptional circumstances can occur. In cases of medical emergencies, family crises, or other significant unforeseen events, please contact us as soon as possible with appropriate documentation, and we will review your case individually.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Consultant Cancellations</h2>
            <p>In rare cases where a consultant needs to cancel or reschedule a consultation:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>You will be notified as soon as possible.</li>
              <li>You will be offered a reschedule with the same consultant or an alternative consultant.</li>
              <li>If no suitable alternative is available, a full refund will be processed automatically.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Technical Issues</h2>
            <p>If technical issues prevent a consultation from taking place:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Both parties should make reasonable efforts to reconnect.</li>
              <li>If the consultation cannot continue, it will be rescheduled at no additional cost.</li>
              <li>If rescheduling is not possible, a pro-rated refund will be offered based on the duration of the consultation completed.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
            <p>If you have any questions about our Cancellation and Refund Policy, please contact us:</p>
            <p>By email: <a href="mailto:support@peace2hearts.com" className="text-peacefulBlue hover:underline">support@peace2hearts.com</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CancellationRefund;

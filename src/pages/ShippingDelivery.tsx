
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';

const ShippingDelivery = () => {
  return (
    <>
      <SEO 
        title="Shipping and Delivery Policy" 
        description="Peace2Hearts Shipping and Delivery Policy - Information about our digital service delivery process."
        keywords="digital delivery, consultation delivery, service delivery, Peace2Hearts"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-lora font-semibold mb-8">Shipping and Delivery Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Digital Service Delivery</h2>
            <p>Peace2Hearts provides digital consultations and services. As such, we do not ship physical products. This policy outlines how our digital services are delivered to you.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Consultation Delivery</h2>
            <p>After booking and payment are completed, you will receive:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li><strong>Confirmation Email:</strong> An immediate confirmation email with your booking details and reference number.</li>
              <li><strong>Consultation Link:</strong> At least 24 hours before your scheduled consultation, you will receive an email with a secure link to join your video consultation.</li>
              <li><strong>Reminder:</strong> A reminder notification will be sent 1 hour before your scheduled consultation.</li>
            </ul>
            
            <p>All consultations are delivered through our secure video conferencing platform. You do not need to download any software, but we recommend using an updated browser (Chrome, Firefox, Safari, or Edge) for the best experience.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Post-Consultation Resources</h2>
            <p>After your consultation, any additional resources or follow-up materials will be delivered to you via email within 48 hours of your consultation, unless otherwise specified by your consultant.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Technical Requirements</h2>
            <p>To ensure proper delivery of our services, you will need:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>A stable internet connection (minimum 1 Mbps upload/download speed recommended)</li>
              <li>A device with a camera and microphone (computer, tablet, or smartphone)</li>
              <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
              <li>A quiet, private space for your consultation</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Service Availability</h2>
            <p>Our consultation services are available based on the consultant's schedule. While we strive to offer flexible timing options, availability may vary based on:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Consultant availability</li>
              <li>Time zones</li>
              <li>Seasonal demands</li>
            </ul>
            <p>The booking system will only display time slots that are currently available.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. International Services</h2>
            <p>Peace2Hearts provides consultations internationally. There are no geographic restrictions on our digital services, although language options may be limited. Currently, our consultations are primarily conducted in English, with select consultants offering services in Hindi and other Indian languages.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Service Delays</h2>
            <p>In rare instances, technical issues or consultant emergencies may cause delays in service delivery. In such cases:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>You will be notified as soon as possible via email and/or phone</li>
              <li>You will be offered the option to reschedule or receive a full refund</li>
              <li>Our team will work diligently to resolve any issues quickly and efficiently</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>If you have any questions about our Shipping and Delivery Policy or are experiencing issues accessing your consultation, please contact us:</p>
            <p>By email: <a href="mailto:support@peace2hearts.com" className="text-peacefulBlue hover:underline">support@peace2hearts.com</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShippingDelivery;

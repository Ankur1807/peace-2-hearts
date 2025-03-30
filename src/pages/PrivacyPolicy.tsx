
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="Peace2Hearts Privacy Policy - Learn how we collect, use, and protect your personal information."
        keywords="privacy policy, data protection, personal information, Peace2Hearts"
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-lora font-semibold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>Welcome to Peace2Hearts ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li><strong>Identity Data</strong>: includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong>: includes email address, telephone numbers, and address.</li>
              <li><strong>Technical Data</strong>: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong>: includes information about how you use our website and services.</li>
              <li><strong>Payment Data</strong>: includes details of services purchased and payment information. We do not store your full payment card details.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>To provide and maintain our service, including to monitor the usage of our service.</li>
              <li>To manage your bookings and appointments.</li>
              <li>To contact you regarding updates, security notifications, and informational messages.</li>
              <li>To process your payment transactions. Your payment details are processed securely by our payment processors and are not stored on our servers.</li>
              <li>To provide customer support and address any inquiries or concerns.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
            <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
            <ul className="list-disc pl-6 mt-2 mb-4">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, you can contact us:</p>
            <p>By email: <a href="mailto:info@peace2hearts.com" className="text-peacefulBlue hover:underline">info@peace2hearts.com</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;

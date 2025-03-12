
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">Terms and Conditions</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </section>
      
      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <div className="prose max-w-none">
              <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-6">
                Welcome to Peace2Hearts ("we," "our," or "us"). These Terms and Conditions govern your use of our website located at peace2hearts.com (the "Site") and all services provided by Peace2Hearts, including but not limited to mental health support and legal consultations (collectively, the "Services").
              </p>
              <p className="text-gray-600 mb-6">
                By accessing our Site or using our Services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Site or use our Services.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">2. Services</h2>
              <p className="text-gray-600 mb-6">
                Peace2Hearts provides relationship wellness and legal support services, including but not limited to mental health counseling, therapy, legal consultations, and educational resources. Our Services are intended to provide guidance and support but should not be considered a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-gray-600 mb-6">
                All Services are subject to availability and may be modified or discontinued at our discretion without notice.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">3. Appointments and Cancellations</h2>
              <p className="text-gray-600 mb-6">
                Appointments for consultations or services must be scheduled in advance. We require at least 24 hours' notice for cancellations or rescheduling. Cancellations made less than 24 hours before the scheduled appointment may be subject to a cancellation fee equal to 50% of the session fee.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">4. Payment and Fees</h2>
              <p className="text-gray-600 mb-6">
                Payment for Services is due at the time of booking unless otherwise specified in writing. We accept various forms of payment, including major credit cards and electronic transfers. All fees are non-refundable except in cases where Services cannot be delivered due to circumstances within our control.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">5. Confidentiality</h2>
              <p className="text-gray-600 mb-6">
                We respect your privacy and maintain strict confidentiality regarding all client information. Information shared during consultations or therapy sessions will not be disclosed to third parties except as required by law or in cases where there is a risk of harm to yourself or others.
              </p>
              <p className="text-gray-600 mb-6">
                Please refer to our Privacy Policy for more information on how we collect, use, and protect your personal information.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-600 mb-6">
                All content on the Site, including text, graphics, logos, images, audio clips, and software, is the property of Peace2Hearts or its content suppliers and is protected by copyright laws. Unauthorized use, reproduction, or distribution of any content from the Site is strictly prohibited.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                In no event shall Peace2Hearts, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">8. Governing Law</h2>
              <p className="text-gray-600 mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the state of California, without regard to its conflict of law provisions.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the Site or Services following the posting of any changes constitutes acceptance of those changes.
              </p>
              
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms, please contact us at support@peace2hearts.com.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Terms;

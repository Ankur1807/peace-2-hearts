
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const Terms = () => {
  return (
    <>
      <GoogleAnalytics />
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
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">1. Introduction & Legal Compliance</h2>
                <p className="text-gray-600 mb-4">
                  Welcome to Peace2Hearts ("P2H"). By using our platform, you agree to these Terms and Conditions ("Terms"). If you do not accept them, please refrain from using our services.
                </p>
                <p className="text-gray-600 mb-4">
                  Peace2Hearts is committed to operating in full compliance with:
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>The Bar Council of India Rules (for legal consultation services).</li>
                  <li>The Mental Healthcare Act, 2017 (for mental health and psychotherapy services).</li>
                </ul>
                <p className="text-gray-600">
                  Our services strictly follow ethical and professional standards to ensure lawful and responsible support.
                </p>
              </div>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">2. Disclaimer & Limitations of Liability</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">2.1 Informational Purpose Only</h3>
                <p className="text-gray-600 mb-4">
                  The information provided on Peace2Hearts is for informational purposes only and should not be considered a substitute for professional legal, psychological, or medical advice.
                  Users must always seek independent professional consultation for legal disputes, psychological concerns, or relationship matters.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">2.2 Compliance with the Bar Council of India</h3>
                <p className="text-gray-600 mb-4">
                  Peace2Hearts fully adheres to the Bar Council of India's Rules, which means:
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>No Solicitation or Advertisement: Advocates listed on our platform do not engage in advertising or soliciting clients.</li>
                  <li>No Unauthorized Legal Practice: Only licensed advocates provide legal consultations.</li>
                  <li>No Fee Misrepresentation: Advocates must charge fees in compliance with Bar Council regulations.</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">2.3 Compliance with The Mental Healthcare Act, 2017</h3>
                <p className="text-gray-600 mb-4">
                  Peace2Hearts operates in strict compliance with the Mental Healthcare Act, 2017, ensuring:
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Only licensed mental health professionals (clinical psychologists, psychiatrists, psychiatric social workers) provide therapy.</li>
                  <li>Confidentiality is strictly maintained, and patient data is securely stored.</li>
                  <li>Emergency & suicide cases require in-person intervention and cannot be managed solely through teletherapy.</li>
                </ul>
              </div>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">3. Booking & Consultations</h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">3.1 Appointment Scheduling</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Users can book legal and mental health consultations via our online platform.</li>
                  <li>Full or partial payment may be required to confirm a booking.</li>
                  <li>Consultant availability is subject to scheduling limitations.</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">3.2 Cancellations & Refunds</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>User-Initiated Cancellations: Must be made at least 24 hours before the scheduled appointment for a full refund or rescheduling.</li>
                  <li>Late Cancellations: Cancellations made within 24 hours may be non-refundable or subject to a cancellation fee.</li>
                  <li>Platform-Initiated Cancellations: If Peace2Hearts cancels an appointment, a full refund or rescheduling will be provided.</li>
                  <li>Refunds are processed within 7-10 business days.</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">3.3 Missed Appointments</h3>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Clients arriving more than 15 minutes late may have their session forfeited.</li>
                  <li>No-shows without prior notice are not eligible for refunds.</li>
                </ul>
              </div>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">4. Confidentiality & Data Protection</h2>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Peace2Hearts ensures strict compliance with confidentiality laws under the Mental Healthcare Act, 2017.</li>
                  <li>All client information is securely stored and never shared without consent.</li>
                  <li>Legal consultations are protected under client-attorney privilege.</li>
                </ul>
              </div>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">5. Availability of Services</h2>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Peace2Hearts offers teletherapy for individuals, couples, and families.</li>
                  <li>Psychological testing, crisis intervention, and high-risk mental health cases require in-person services and will be referred accordingly.</li>
                  <li>Legal consultations follow the Bar Council of India's ethical guidelines.</li>
                </ul>
              </div>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">6. Code of Conduct</h2>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Users must engage respectfully with consultants.</li>
                  <li>Harassment, abuse, or inappropriate behavior will result in immediate termination of services without a refund.</li>
                  <li>Consultants reserve the right to refuse service if they feel unsafe or uncomfortable.</li>
                </ul>
              </div>
              
              <div className="mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">7. Governing Law & Dispute Resolution</h2>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Any disputes must be reported to support@peace2hearts.com first.</li>
                  <li>If unresolved, disputes will be handled under the laws of the jurisdiction where Peace2Hearts is headquartered.</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-4">8. Updates to Terms</h2>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Peace2Hearts reserves the right to update these Terms at any time.</li>
                  <li>Continued use of the platform constitutes acceptance of any revisions.</li>
                </ul>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  If you have any questions about these Terms, please contact us at support@peace2hearts.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Terms;

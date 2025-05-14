
import SubServiceLayout from "@/components/SubServiceLayout";
import { SEO } from '@/components/SEO';
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const GeneralConsultation = () => {
  return (
    <>
      <SEO 
        title="General Legal Consultation"
        description="Get comprehensive legal guidance for your relationship challenges with our general legal consultation services at Peace2Hearts."
        keywords="general legal advice, relationship legal counseling, family law consultation, legal support, relationship challenges"
      />
      <SubServiceLayout
        title="General Legal Consultation"
        description="Broad legal insights tailored to your unique relationship challenges."
        image="https://images.unsplash.com/photo-1618044733300-9472054094ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
        serviceType="legal-support"
        serviceName="general"
        benefits={[
          "Personalized advice for your specific relationship legal concerns",
          "Clarity on complex legal matters in plain, understandable language",
          "Overview of available legal options and potential outcomes",
          "Strategic guidance for making informed decisions",
          "Access to legal expertise without long-term commitments",
          "Comprehensive approach addressing all aspects of your situation"
        ]}
      >
        <ServiceInfoSection 
          whoCanBenefit={[
            { text: "Individuals feeling legally lost in their relationship journey" },
            { text: "Those unsure whether they need a lawyer yet" },
            { text: "People facing early red flags or emotional/legal grey areas" },
            { text: "Anyone seeking legal peace of mind before making decisions" }
          ]}
          howItWorks={[
            { text: "Tell us what's worrying you" },
            { text: "Speak to a legal consultant in a relaxed setting" },
            { text: "Ask anything — no documentation needed yet" },
            { text: "Walk away with clarity, not confusion" }
          ]}
          mandalaColor="bg-gray-50"
          whoCanBenefitClassName="bg-gradient-3"
          howItWorksClassName="bg-gradient-2"
        />
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="section-title text-2xl mb-6">About Our General Legal Consultation</h2>
              <p className="text-gray-600 mb-4">
                Relationship challenges often come with complex legal questions that don't fit neatly into categories. Our general legal consultation service provides comprehensive guidance tailored to your unique situation, whatever it may involve.
              </p>
              <p className="text-gray-600 mb-4">
                Whether you're dealing with multiple issues simultaneously, have questions that cross several legal domains, or simply aren't sure what type of legal advice you need, our experienced consultants can help. We take the time to understand your full situation before providing clear, practical guidance.
              </p>
              <p className="text-gray-600 mb-8">
                Our approach is holistic and solution-focused, ensuring you gain a comprehensive understanding of your legal position and options without feeling overwhelmed by legal jargon or unnecessary details.
              </p>
              
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Common Areas Our General Consultation Covers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Complex scenarios involving multiple legal issues</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Initial assessment to identify relevant legal concerns</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Guidance on legal documentation and court procedures</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Overview of possible legal strategies and their implications</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Referrals to specialized legal resources when needed</p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </SubServiceLayout>
    </>
  );
};

export default GeneralConsultation;

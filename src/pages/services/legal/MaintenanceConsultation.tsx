
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const MaintenanceConsultation = () => {
  return (
    <SubServiceLayout
      title="Maintenance Consultation"
      description="Advice on alimony, financial support, and equitable agreements for separated or divorced partners."
      image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="maintenance"
      benefits={[
        "Understanding your rights and obligations regarding maintenance",
        "Knowledge about factors that influence maintenance determinations",
        "Guidance on calculating appropriate maintenance amounts",
        "Strategies for negotiating fair maintenance agreements",
        "Information on modifying maintenance orders when circumstances change",
        "Support for addressing maintenance payment issues"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Spouses unsure about their financial rights after separation" },
          { text: "Individuals struggling to receive or provide post-divorce support" },
          { text: "Women left financially vulnerable after marital breakdown" },
          { text: "Anyone considering or contesting a maintenance order" }
        ]}
        howItWorks={[
          { text: "Brief us on your financial and marital situation" },
          { text: "Consult with a lawyer who understands spousal support law" },
          { text: "Learn what you're entitled to — and what's realistic" },
          { text: "Decide next steps with both clarity and caution" }
        ]}
        mandalaColor="bg-amber-50"
        whoCanBenefitClassName="bg-gradient-5"
        howItWorksClassName="bg-gradient-6"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Maintenance Consultation</h2>
            <p className="text-gray-600 mb-4">
              Financial stability is a critical concern during relationship transitions. Our maintenance consultation service provides clear, practical guidance on alimony, spousal support, and other financial considerations in separation or divorce scenarios.
            </p>
            <p className="text-gray-600 mb-4">
              Our experienced legal consultants explain the legal framework for maintenance determinations, helping you understand the factors courts consider when deciding whether to award maintenance, how much to award, and for how long. We'll help you evaluate your specific situation and develop reasonable expectations.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you anticipate paying or receiving maintenance, our objective advice helps you navigate this complex aspect of relationship dissolution with confidence and clarity.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What Our Consultation Covers</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Overview of maintenance laws and eligibility criteria</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Analysis of factors affecting maintenance decisions in your case</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Discussion of temporary vs. permanent maintenance options</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Guidance on documenting income and expenses for maintenance calculations</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Strategies for negotiating maintenance terms in settlement agreements</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default MaintenanceConsultation;

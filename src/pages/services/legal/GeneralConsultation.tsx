
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const GeneralConsultation = () => {
  return (
    <SubServiceLayout
      title="General Legal Consultation"
      description="Professional legal advice for relationship matters, helping you understand your rights and make informed decisions."
      image="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
      serviceType="legal-support"
      serviceName="general"
      benefits={[
        "Clarity on your legal rights and options in relationship matters",
        "Expert guidance tailored to your specific circumstances",
        "Information on legal processes and what to expect",
        "Strategy development for addressing relationship legal challenges",
        "Understanding of potential outcomes before making decisions",
        "Identification of the most appropriate legal path forward"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Anyone facing relationship-related legal questions or concerns" },
          { text: "Individuals needing to understand their legal rights and options" },
          { text: "Those requiring legal guidance before making major relationship decisions" },
          { text: "People seeking professional advice on relationship legal matters" }
        ]}
        howItWorks={[
          { text: "Schedule a confidential consultation with our legal team" },
          { text: "Discuss your situation and concerns with a qualified attorney" },
          { text: "Receive clear explanations of relevant laws and your options" },
          { text: "Walk away with practical next steps tailored to your needs" }
        ]}
        mandalaColor="bg-blue-50"
        whoCanBenefitClassName="bg-gradient-2"
        howItWorksClassName="bg-gradient-5"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default GeneralConsultation;


import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const DivorceConsultation = () => {
  return (
    <SubServiceLayout
      title="Divorce Consultation"
      description="Expert legal guidance and emotional support through the divorce process, protecting your interests and well-being."
      image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="divorce"
      benefits={[
        "Professional guidance on navigating the divorce process",
        "Understanding your rights and options before making decisions",
        "Strategies for an amicable separation where possible",
        "Clarity on property division, maintenance, and child custody issues",
        "Protection of your financial interests during settlement",
        "Emotional support alongside legal advice"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Individuals considering divorce or already in the process" },
          { text: "Those seeking to understand their legal rights before making decisions" },
          { text: "People wanting to minimize conflict during separation" },
          { text: "Anyone needing guidance on property division or financial settlements" }
        ]}
        howItWorks={[
          { text: "Schedule a confidential initial consultation" },
          { text: "Discuss your situation with a specialized divorce attorney" },
          { text: "Receive clear information about your options and rights" },
          { text: "Develop a strategic plan tailored to your specific needs" }
        ]}
        mandalaColor="bg-indigo-50"
        whoCanBenefitClassName="bg-gradient-1"
        howItWorksClassName="bg-gradient-4"
        useNewLayout={true}
      />
    </SubServiceLayout>
  );
};

export default DivorceConsultation;

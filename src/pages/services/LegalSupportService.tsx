
import React from 'react';
import ServiceLayout from "@/components/ServiceLayout";
import SubServicesList from "@/components/SubServicesList";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";
import { Card } from "@/components/ui/card";

const LegalSupportService: React.FC = () => {
  const legalSubServices = [
    {
      id: "divorce",
      title: "Divorce Consultation",
      description: "Expert legal guidance and emotional support through the divorce process.",
      path: "/services/legal-support/divorce"
    },
    {
      id: "mediation",
      title: "Mediation Services",
      description: "Facilitating peaceful resolutions to legal disputes through guided dialogue.",
      path: "/services/legal-support/mediation"
    },
    {
      id: "custody",
      title: "Child Custody Consultation",
      description: "Guidance on custody arrangements that prioritize your child's wellbeing.",
      path: "/services/legal-support/custody"
    },
    {
      id: "maintenance",
      title: "Maintenance Consultation",
      description: "Advice on alimony, financial support, and equitable agreements.",
      path: "/services/legal-support/maintenance"
    },
    {
      id: "general",
      title: "General Legal Consultation",
      description: "Professional legal advice for various relationship matters.",
      path: "/services/legal-support/general"
    }
  ];

  const forWhom = [
    "Individuals considering or going through divorce proceedings",
    "Parents navigating child custody and co-parenting arrangements",
    "Those seeking mediation as an alternative to adversarial legal processes",
    "People needing guidance on maintenance and financial settlements",
    "Couples wanting to understand their legal rights and options",
    "Anyone requiring legal support for relationship-related matters"
  ];

  const howItWorks = [
    "Schedule a confidential consultation to discuss your legal concerns",
    "Meet with an experienced attorney specializing in family law",
    "Receive clear information about your rights, options, and likely outcomes",
    "Develop a strategic plan tailored to your specific situation and goals"
  ];

  return (
    <ServiceLayout
      title="Legal Support Services"
      description="Our legal support services provide expert guidance for navigating the legal aspects of relationships, helping you understand your rights and make informed decisions with confidence."
      image="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      forWhom={forWhom}
      howItWorks={howItWorks}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="section-title text-3xl mb-6 text-center">Our Legal Support Approach</h2>
            <Card className="p-6 shadow-md">
              <p className="text-gray-600 mb-4">
                At Peace2Hearts, our legal support services focus on providing clarity, compassion, and practical guidance during challenging relationship transitions. We understand that legal issues related to relationships can be emotionally complex, which is why our approach combines expert legal advice with sensitivity to the personal aspects of your situation.
              </p>
              <p className="text-gray-600">
                Our team of experienced attorneys specializes in family law and relationship matters, offering strategic counsel that protects your interests while minimizing conflict whenever possible. Whether you're facing divorce, custody disputes, maintenance issues, or need general legal advice, we provide the knowledge and support you need to navigate the legal system with confidence.
              </p>
            </Card>
          </div>
          
          <ServiceInfoSection 
            whoCanBenefit={[
              { text: "Individuals seeking legal clarity during relationship transitions" },
              { text: "Those navigating divorce, custody, or maintenance issues" },
              { text: "People looking for alternative dispute resolution methods" },
              { text: "Anyone needing to understand their rights in relationship matters" }
            ]}
            howItWorks={[
              { text: "Schedule an initial confidential consultation" },
              { text: "Meet with a specialized family law attorney" },
              { text: "Discuss your specific situation and legal concerns" },
              { text: "Receive strategic guidance tailored to your goals" }
            ]}
            mandalaColor="bg-indigo-50"
            whoCanBenefitClassName="bg-gradient-1"
            howItWorksClassName="bg-gradient-4"
            useNewLayout={true}
          />
          
          <SubServicesList subServices={legalSubServices} />
        </div>
      </section>
    </ServiceLayout>
  );
};

export default LegalSupportService;

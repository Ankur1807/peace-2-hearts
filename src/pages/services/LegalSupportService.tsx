
import React from 'react';
import ServiceLayout from "@/components/ServiceLayout";
import SubServicesList from "@/components/SubServicesList";

const LegalSupportService: React.FC = () => {
  const legalSubServices = [
    {
      id: "mediation",
      title: "Mediation Services",
      description: "Facilitating peaceful resolutions to legal disputes through guided, collaborative dialogue.",
      path: "/services/legal-support/mediation"
    },
    {
      id: "divorce",
      title: "Divorce Consultation",
      description: "Gain expert insights into the legal aspects of divorce to make informed decisions.",
      path: "/services/legal-support/divorce"
    },
    {
      id: "custody",
      title: "Child Custody Consultation",
      description: "Support for understanding and advocating in custody decisions for the best outcomes for children.",
      path: "/services/legal-support/custody"
    },
    {
      id: "maintenance",
      title: "Maintenance Consultation",
      description: "Advice on alimony, financial support, and equitable agreements for separated or divorced partners.",
      path: "/services/legal-support/maintenance"
    },
    {
      id: "general-legal",
      title: "General Consultation",
      description: "Broad legal insights tailored to your unique relationship challenges.",
      path: "/services/legal-support/general"
    }
  ];

  const forWhom = [
    "Couples considering divorce and needing legal guidance",
    "Parents navigating child custody and support arrangements",
    "Individuals seeking pre-nuptial or post-nuptial agreements",
    "People needing protection from domestic abuse through legal means",
    "Those with questions about relationship property division",
    "Anyone needing legal documentation related to relationship changes"
  ];

  const howItWorks = [
    "Schedule an initial legal consultation to discuss your situation",
    "Meet with an experienced attorney specializing in relationship law",
    "Receive clear explanations of your legal options and rights",
    "Develop a strategic plan for your specific legal needs"
  ];

  return (
    <ServiceLayout
      title="Legal Support & Consultation"
      description="Our experienced legal team provides compassionate guidance on all aspects of relationship law, including divorce proceedings, custody arrangements, and pre-marital legal counseling."
      image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      forWhom={forWhom}
      howItWorks={howItWorks}
      serviceType="legal-support"
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title text-3xl mb-6">Our Legal Expertise</h2>
              <p className="text-gray-600 mb-4">
                Peace2Hearts' legal team understands that relationship legal matters require both expertise and empathy. Our attorneys specialize in all aspects of family and relationship law, providing guidance that protects your interests while minimizing conflict.
              </p>
              <p className="text-gray-600 mb-4">
                We pride ourselves on explaining complex legal concepts in clear, accessible language, ensuring you fully understand your options and can make informed decisions during difficult times.
              </p>
              <p className="text-gray-600">
                Whether you need assistance with divorce proceedings, custody arrangements, or preventative legal measures like pre-nuptial agreements, our team will provide the knowledgeable support you need.
              </p>
            </div>
            <div>
              <h2 className="section-title text-3xl mb-6">Legal Services We Provide</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Divorce and separation legal guidance</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Child custody and support arrangements</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Pre-nuptial and post-nuptial agreements</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Property division and financial settlements</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Protective orders and domestic violence legal support</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Mediation and collaborative divorce options</p>
                </li>
              </ul>
            </div>
          </div>
          
          <SubServicesList subServices={legalSubServices} />
        </div>
      </section>
    </ServiceLayout>
  );
};

export default LegalSupportService;

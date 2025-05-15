
import React from 'react';
import ServiceLayout from "@/components/ServiceLayout";
import SubServicesList from "@/components/SubServicesList";
import { cn } from "@/lib/utils";
import SiteCard from "@/components/SiteCard";

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

  // Function to get gradient class based on index for cards
  const getGradientClass = (index: number) => {
    const gradientClasses = [
      'bg-gradient-4',
      'bg-gradient-1',
      'bg-gradient-6', 
      'bg-gradient-3',
      'bg-gradient-2',
      'bg-gradient-5'
    ];
    return gradientClasses[index % gradientClasses.length];
  };

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
          {/* Our Offerings Section - Moved to top */}
          <div className="mb-16">
            <h3 className="text-2xl font-lora font-semibold text-gray-800 mb-6 text-center">Our Offerings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {legalSubServices.map((service, index) => (
                <div 
                  key={service.id}
                  className={cn(
                    "p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300",
                    "transform hover:-translate-y-1 cursor-pointer relative overflow-hidden offering-card",
                    getGradientClass(index)
                  )}
                  onClick={() => window.location.href = service.path}
                >
                  <div className="ripple-container">
                    <div className="ripple-effect"></div>
                  </div>
                  <h4 className="font-medium text-gray-800 text-xl mb-2 text-center">{service.title}</h4>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Key Benefits Section */}
          <div className="mb-16">
            <h2 className="section-title text-3xl mb-8 text-center">Key Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Expert legal guidance from attorneys specializing in family law",
                "Clear understanding of your rights and options in relationship matters",
                "Strategic planning to protect your interests and achieve favorable outcomes",
                "Compassionate support during emotionally challenging legal processes",
                "Practical advice on navigating complex legal procedures and documentation",
                "Solutions focused on minimizing conflict and emotional distress"
              ].map((benefit, index) => (
                <div key={index} className={cn(
                  "p-5 rounded-xl shadow-sm border border-gray-100 flex items-start text-center benefit-card", 
                  getGradientClass(index)
                )}>
                  <p className="text-gray-700 mx-auto">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Who is this for? and How It Works sections side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <SiteCard className="bg-gradient-1 flex flex-col h-full">
              <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">Who is this for?</h2>
              <ul className="space-y-4 text-center">
                {[
                  "Individuals seeking legal clarity during relationship transitions",
                  "Those navigating divorce, custody, or maintenance issues",
                  "People looking for alternative dispute resolution methods",
                  "Anyone needing to understand their rights in relationship matters"
                ].map((item, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <div className="max-w-md text-center">
                      <p className="text-gray-700">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SiteCard>
            
            <SiteCard className="bg-gradient-4 flex flex-col h-full">
              <h2 className="section-title text-2xl md:text-3xl mb-6 text-center">How It Works</h2>
              <ul className="space-y-4 text-center">
                {[
                  "Schedule an initial confidential consultation",
                  "Meet with a specialized family law attorney",
                  "Discuss your specific situation and legal concerns",
                  "Receive strategic guidance tailored to your goals"
                ].map((item, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <div className="max-w-md text-center">
                      <p className="text-gray-700">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SiteCard>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default LegalSupportService;

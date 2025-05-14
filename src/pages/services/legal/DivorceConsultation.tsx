
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DivorceConsultation = () => {
  return (
    <SubServiceLayout
      title="Divorce Consultation"
      description="Gain expert insights into the legal aspects of divorce to make informed decisions throughout the process."
      image="https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="divorce"
      benefits={[
        "Clear understanding of divorce procedures and legal requirements",
        "Guidance on property division and financial settlements",
        "Information on rights and responsibilities regarding children",
        "Insights into available mediation and collaborative divorce options",
        "Strategic advice for protecting your interests during proceedings",
        "Support for drafting and reviewing divorce petitions and agreements"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Individuals considering separation but unsure of next steps" },
          { text: "Those facing emotional or legal pressure in a failing marriage" },
          { text: "People seeking clarity before initiating or responding to a divorce" },
          { text: "Anyone looking to protect their peace without escalating conflict" }
        ]}
        howItWorks={[
          { text: "Tell us where you stand emotionally and legally" },
          { text: "Speak with a family lawyer trained in divorce mediation" },
          { text: "Get your rights explained — no pressure to litigate" },
          { text: "Decide what's right for you, informed and calm" }
        ]}
        mandalaColor="bg-blue-50"
        whoCanBenefitClassName="bg-gradient-to-br from-softPink/30 to-white"
        howItWorksClassName="bg-gradient-to-br from-lightBlue/30 to-white"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Divorce Consultation Service</h2>
            <p className="text-gray-600 mb-4">
              At Peace2Hearts, we understand that divorce is one of life's most challenging transitions. Our divorce consultation service provides clear, empathetic legal guidance to help you navigate this complex process with confidence and dignity.
            </p>
            <p className="text-gray-600 mb-4">
              Our experienced legal professionals will explain your rights, options, and the potential outcomes of different approaches to divorce. We focus on helping you make informed decisions that protect your interests while minimizing conflict and emotional strain.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you're considering divorce, in the early stages of separation, or need guidance on a specific aspect of your ongoing divorce, our consultation service provides the expert legal support you need during this difficult time.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Our Approach to Divorce Consultation</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Comprehensive assessment of your specific situation</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Clear explanation of divorce laws and procedures</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Discussion of options for division of assets and liabilities</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Guidance on child custody, support, and visitation matters</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Strategic advice for negotiating favorable settlements</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default DivorceConsultation;

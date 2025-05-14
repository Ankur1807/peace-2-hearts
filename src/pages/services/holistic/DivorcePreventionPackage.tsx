
import ServiceLayout from "@/components/ServiceLayout";
import { Check } from "lucide-react";
import HolisticHeroBanner from "@/components/services/holistic/HolisticHeroBanner";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const DivorcePreventionPackage = () => {
  const whoIsThisFor = [
    { text: "Individuals considering separation but unsure of next steps" },
    { text: "Those facing emotional or legal pressure in a failing marriage" },
    { text: "People seeking clarity before initiating or responding to a divorce" },
    { text: "Anyone looking to protect their peace without escalating conflict" }
  ];

  const howItWorks = [
    { text: "Schedule a clarity session to share what you're experiencing" },
    { text: "Speak with both a legal and mental health expert collaboratively" },
    { text: "Receive guidance tailored to your emotional and legal needs" },
    { text: "Walk away informed, grounded, and equipped to choose your next steps" }
  ];

  const keyBenefits = [
    "Neutral, judgment-free space to process big decisions",
    "Emotional support paired with legal insight",
    "Awareness of your rights and options — before taking action",
    "Conflict de-escalation and long-term wellbeing planning",
    "Customized clarity plan to support your values and priorities",
    "Prevent unnecessary legal steps and trauma through early guidance"
  ];

  return (
    <ServiceLayout
      title="Divorce Prevention Package"
      description="A comprehensive approach to resolving relationship challenges before they lead to separation, combining therapy and legal mediation."
      image="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      customHeroBanner={<HolisticHeroBanner serviceType="divorce-prevention" className="h-full w-full min-h-[250px] sm:min-h-[350px] shadow-lg" />}
      forWhom={keyBenefits}
    >
      <ServiceInfoSection 
        whoCanBenefit={whoIsThisFor}
        howItWorks={howItWorks}
        mandalaColor="bg-peacefulBlue/5"
        whoCanBenefitClassName="bg-gradient-2"
        howItWorksClassName="bg-gradient-3"
      />

      <section className="py-16 bg-softGray">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-3xl mb-8 text-center">What's Included in This Package</h2>
            
            <div className="grid md:grid-cols-2 gap-10 mb-10">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">2 Therapy Sessions</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Deep exploration of relationship patterns and challenges</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Communication improvement techniques and practice</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Emotional reconnection strategies</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-vibrantPurple mr-2 mt-0.5" />
                    <span className="text-gray-600">Tools for managing conflicts constructively</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">1 Mediation Session</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Neutral facilitation of difficult conversations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Focus on specific points of ongoing conflict</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Development of mutually acceptable solutions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                    <span className="text-gray-600">Creation of agreements for moving forward</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">1 Legal Consultation</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                  <span className="text-gray-600">Clear explanation of legal options and their implications</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                  <span className="text-gray-600">Information about the divorce process if needed</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                  <span className="text-gray-600">Guidance on creating legal agreements that support your decisions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-peacefulBlue mr-2 mt-0.5" />
                  <span className="text-gray-600">Understanding of financial and property considerations</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-12 bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Package Benefits</h3>
              <p className="text-gray-600 mb-6">
                Our Divorce Prevention Package offers couples a comprehensive approach by:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Addressing both emotional and practical aspects of your challenges</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Providing a safe space to explore all options before making decisions</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Equipping you with communication tools that will benefit your relationship</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Ensuring you understand all implications of potential decisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default DivorcePreventionPackage;

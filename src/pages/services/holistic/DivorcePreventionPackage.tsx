
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SiteCard from "@/components/SiteCard";

const DivorcePreventionPackage = () => {
  return (
    <SubServiceLayout
      title="Divorce Prevention Package"
      description="A comprehensive approach to preventing divorce through combined legal clarity and emotional support."
      image="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="legal-support"
      serviceName="divorce-prevention"
      benefits={[
        "Neutral, judgment-free space to process big decisions",
        "Emotional support paired with legal insight",
        "Awareness of your rights and options — before taking action",
        "Conflict de-escalation and long-term wellbeing planning",
        "Customized clarity plan to support your values and priorities",
        "Prevent unnecessary legal steps and trauma through early guidance"
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
          { text: "Schedule a clarity session to share what you're experiencing" },
          { text: "Speak with both a legal and mental health expert collaboratively" },
          { text: "Receive guidance tailored to your emotional and legal needs" },
          { text: "Walk away informed, grounded, and equipped to choose your next steps" }
        ]}
        mandalaColor="bg-purple-50"
        whoCanBenefitClassName="bg-gradient-1"
        howItWorksClassName="bg-gradient-4"
        useNewLayout={true}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6 text-center">About Our Divorce Prevention Package</h2>
            <p className="text-gray-600 mb-6">
              At Peace2Hearts, we believe that many divorces can be prevented with early, holistic intervention. Our Divorce Prevention Package combines the expertise of both legal and mental health professionals to provide you with comprehensive support during relationship crises.
            </p>
            <p className="text-gray-600 mb-6">
              Whether you're experiencing communication breakdowns, considering separation, or already discussing divorce, this package offers a safe space to explore all options before making life-altering decisions.
            </p>
            
            <div className="my-8">
              <AspectRatio ratio={16/9} className="bg-muted rounded-md overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                  alt="Couple in discussion with counselor" 
                  className="object-cover h-full w-full" 
                />
              </AspectRatio>
            </div>
            
            <SiteCard className="mb-8">
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Our Approach</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Combined sessions with both legal and mental health professionals</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Exploration of the emotional dynamics affecting your relationship</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Clear information about legal implications of various options</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Communication techniques to reduce conflict and increase understanding</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-xs">✓</span>
                  </div>
                  <p className="text-gray-600">Development of a personalized clarity plan for moving forward</p>
                </li>
              </ul>
            </SiteCard>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default DivorcePreventionPackage;

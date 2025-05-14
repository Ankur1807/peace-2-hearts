
import SubServiceLayout from "@/components/SubServiceLayout";
import ServiceInfoSection from "@/components/services/ServiceInfoSection";

const CouplesCounselling = () => {
  return (
    <SubServiceLayout
      title="Couples Counselling"
      description="Professional guidance to strengthen communication and mutual understanding in your relationship."
      image="https://images.unsplash.com/photo-1516058575910-2d692b5206e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="couples-counselling" 
      benefits={[
        "Improved communication skills to express needs effectively",
        "Strategies to resolve recurring conflicts constructively",
        "Renewed emotional connection and intimacy",
        "Tools to navigate challenging life transitions together",
        "Greater understanding of each other's perspectives and needs",
        "Techniques to rebuild trust and heal from past hurts"
      ]}
    >
      <ServiceInfoSection 
        whoCanBenefit={[
          { text: "Couples struggling with miscommunication, resentment, or mistrust" },
          { text: "Partners drifting apart emotionally or facing recurring conflict" },
          { text: "Those dealing with infidelity, jealousy, or unmet expectations" },
          { text: "Couples preparing for a major life decision (marriage, children, relocation)" }
        ]}
        howItWorks={[
          { text: "Tell us what you're facing as a couple" },
          { text: "Get matched with a relationship counselor" },
          { text: "Work through challenges together in safe, guided sessions" },
          { text: "Learn tools to reconnect and rebuild understanding" }
        ]}
        mandalaColor="bg-softGreen/5"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Couples Counselling</h2>
            <p className="text-gray-600 mb-4">
              At Peace2Hearts, our couples counselling services help partners strengthen their relationship, overcome challenges, and build a healthier connection. Our experienced therapists create a safe, non-judgmental environment where both partners can express themselves openly and work toward shared goals.
            </p>
            <p className="text-gray-600 mb-4">
              Whether you're experiencing communication difficulties, trust issues, intimacy concerns, or simply feel disconnected, our counselling can help you reconnect and move forward together. We also support couples through major life transitions that can strain relationships, such as career changes, parenthood, or health challenges.
            </p>
            <p className="text-gray-600 mb-8">
              Our approach is tailored to each couple's unique dynamics and needs, with a focus on practical strategies you can implement between sessions to strengthen your relationship.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">Our Approach</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Initial joint assessment to understand your relationship dynamics</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Structured sessions focused on your specific concerns and goals</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Evidence-based techniques to improve communication and resolve conflicts</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Practical exercises to practice between sessions</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Ongoing support as you implement new relationship skills</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default CouplesCounselling;

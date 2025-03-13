
import SubServiceLayout from "@/components/SubServiceLayout";

const MentalHealthCounselling = () => {
  return (
    <SubServiceLayout
      title="Mental Health Counselling"
      description="Structured therapy sessions to help you process emotions, build resilience, and overcome relationship-related mental health challenges."
      image="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      serviceType="mental-health"
      serviceName="counselling"
      benefits={[
        "Professional support for anxiety, depression, and stress related to relationships",
        "Personalized strategies to build emotional resilience",
        "Tools to manage difficult emotions during relationship transitions",
        "Safe space to process grief, loss, and heartbreak",
        "Guidance for rebuilding self-esteem and confidence",
        "Techniques to establish healthy boundaries in relationships"
      ]}
    >
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-2xl mb-6">About Our Mental Health Counselling</h2>
            <p className="text-gray-600 mb-4">
              At Peace2Hearts, our mental health counselling services are designed to provide you with professional support during challenging relationship periods. Our licensed therapists specialize in relationship-focused mental health care and can help you navigate anxiety, depression, stress, and trauma.
            </p>
            <p className="text-gray-600 mb-4">
              Through structured, evidence-based therapy sessions, you'll gain insights into your emotional patterns, develop practical coping strategies, and build resilience that extends beyond your current situation.
            </p>
            <p className="text-gray-600 mb-8">
              Whether you're dealing with the aftermath of a breakup, processing complex emotions during a divorce, or managing ongoing stress in your current relationship, our mental health counselling provides the support and guidance you need.
            </p>
            
            <h3 className="text-xl font-lora font-semibold text-gray-800 mb-4">What to Expect</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Initial assessment to understand your unique challenges and goals</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Customized treatment plan tailored to your specific needs</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Regular therapy sessions with a licensed mental health professional</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Practical exercises and tools to implement between sessions</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                  <span className="text-peacefulBlue text-xs">✓</span>
                </div>
                <p className="text-gray-600">Progress tracking and adjustment of strategies as needed</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SubServiceLayout>
  );
};

export default MentalHealthCounselling;


import ServiceLayout from "@/components/ServiceLayout";
import SubServicesList from "@/components/SubServicesList";

const MentalHealthService = () => {
  const mentalHealthSubServices = [
    {
      id: "mental-health-counselling",
      title: "Mental Health Counselling",
      description: "Structured therapy sessions to rebuild trust and resolve conflicts in relationships.",
      path: "/services/mental-health/counselling"
    },
    {
      id: "family-therapy",
      title: "Family Therapy",
      description: "Strengthening family bonds by addressing conflicts and fostering understanding.",
      path: "/services/mental-health/family-therapy"
    },
    {
      id: "premarital-counselling",
      title: "Premarital Counselling",
      description: "Preparing couples for a strong and fulfilling marriage through guided discussions and planning.",
      path: "/services/mental-health/premarital-counselling"
    },
    {
      id: "couples-counselling",
      title: "Couples Counselling",
      description: "Professional guidance to strengthen communication and mutual understanding.",
      path: "/services/mental-health/couples-counselling"
    },
    {
      id: "sexual-health-counselling",
      title: "Sexual Health Counselling",
      description: "Specialized support for addressing intimacy concerns and enhancing relationship satisfaction.",
      path: "/services/mental-health/sexual-health-counselling"
    }
  ];

  return (
    <ServiceLayout
      title="Mental Health Support"
      description="Our mental health services provide specialized support for individuals navigating relationship challenges, including anxiety, depression, stress, and trauma related to difficult relationships."
      image="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      forWhom={[
        "Individuals experiencing anxiety or depression related to relationship issues",
        "Those struggling with stress from ongoing relationship conflicts",
        "People healing from relationship trauma or emotional abuse",
        "Anyone going through a major relationship transition like divorce or separation",
        "Partners seeking to improve their mental wellbeing while in a relationship",
        "Those rebuilding their identity and confidence after a breakup"
      ]}
      howItWorks={[
        "Schedule an initial consultation to discuss your needs and concerns",
        "Get matched with a licensed mental health professional specializing in relationship issues",
        "Develop a personalized treatment plan tailored to your specific situation",
        "Engage in regular therapy sessions to address your mental health needs"
      ]}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title text-3xl mb-6">Our Approach</h2>
              <p className="text-gray-600 mb-4">
                At Peace2Hearts, we understand that relationship challenges can significantly impact your mental wellbeing. Our approach combines evidence-based therapeutic techniques with compassionate support to help you navigate these difficult times.
              </p>
              <p className="text-gray-600 mb-4">
                Our licensed therapists specialize in relationship-focused mental health care and can help you develop coping strategies, process emotions, and rebuild your sense of self-worth and confidence.
              </p>
              <p className="text-gray-600">
                Whether you're dealing with anxiety, depression, trauma, or stress related to your relationships, our team is here to provide the support and guidance you need to heal and grow.
              </p>
            </div>
            <div>
              <h2 className="section-title text-3xl mb-6">What to Expect</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Safe, confidential therapy sessions with a licensed professional</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Personalized treatment plans based on your unique needs</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Practical coping strategies to manage anxiety, stress, and depression</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Emotional support and validation during difficult relationship transitions</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Tools for rebuilding self-esteem and identity after relationship challenges</p>
                </li>
              </ul>
            </div>
          </div>
          
          <SubServicesList subServices={mentalHealthSubServices} />
        </div>
      </section>
    </ServiceLayout>
  );
};

export default MentalHealthService;

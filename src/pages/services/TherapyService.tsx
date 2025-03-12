
import ServiceLayout from "@/components/ServiceLayout";

const TherapyService = () => {
  return (
    <ServiceLayout
      title="Relationship Therapy"
      description="Our relationship therapy services help couples and individuals navigate challenges, improve communication, and develop healthier patterns in their relationships."
      image="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
      forWhom={[
        "Couples experiencing communication difficulties",
        "Partners navigating trust issues or infidelity",
        "Individuals seeking to understand unhealthy relationship patterns",
        "Couples considering separation but wanting to explore options",
        "Partners in transition periods (new baby, career changes, etc.)",
        "Those wanting to strengthen an already good relationship"
      ]}
      howItWorks={[
        "Complete an initial assessment to identify relationship challenges",
        "Meet with a specialized relationship therapist",
        "Develop personalized strategies for improving communication and connection",
        "Practice new skills in and outside of therapy sessions"
      ]}
    >
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="section-title text-3xl mb-6">Our Therapeutic Approach</h2>
              <p className="text-gray-600 mb-4">
                At Peace2Hearts, our relationship therapy combines evidence-based approaches including Emotionally Focused Therapy (EFT), Gottman Method, and cognitive-behavioral techniques to help couples and individuals develop healthier relationship patterns.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that most relationship challenges stem from disconnection and communication barriers. Our therapists help you identify these patterns and develop new ways of relating that foster security, trust, and intimacy.
              </p>
              <p className="text-gray-600">
                Whether you're looking to repair trust after a breach, improve day-to-day communication, or determine if a relationship is sustainable, our therapists provide a safe, non-judgmental space to explore these important questions.
              </p>
            </div>
            <div>
              <h2 className="section-title text-3xl mb-6">Benefits of Relationship Therapy</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Improved communication skills and fewer destructive arguments</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Greater emotional intimacy and connection</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Tools for navigating conflicts and differences constructively</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Deeper understanding of each other's needs and attachment styles</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-peacefulBlue/20 flex items-center justify-center mr-3 mt-1">
                    <span className="text-peacefulBlue text-sm">✓</span>
                  </div>
                  <p className="text-gray-600">Clarity about relationship future and shared goals</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </ServiceLayout>
  );
};

export default TherapyService;

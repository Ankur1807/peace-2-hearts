
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ExpertiseTabProps {
  consultant: {
    specialization: string;
  };
  formatSpecialization: (specialization: string) => string;
}

export function ExpertiseTab({ consultant, formatSpecialization }: ExpertiseTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Areas of Expertise</CardTitle>
          <CardDescription>Specialized knowledge and skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">{formatSpecialization(consultant.specialization)}</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {consultant.specialization === 'legal' ? 
                "Providing expert legal guidance on matters related to relationships, marriage, and family law. Specialized in helping clients understand their legal rights and options during challenging times." :
                consultant.specialization === 'mental_health' ?
                "Offering professional mental health support focused on relationship dynamics, personal growth, and emotional wellbeing. Specialized in providing strategies for healing and moving forward." :
                "Delivering specialized consultation services to help clients navigate complex personal challenges with expert guidance and support."}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h4 className="font-medium mb-2">What to expect during consultations:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {consultant.specialization === 'legal' ? (
                  <>
                    <li>Comprehensive assessment of your legal situation</li>
                    <li>Clear explanation of your legal rights and options</li>
                    <li>Strategic guidance on possible next steps</li>
                    <li>Answers to your specific legal questions</li>
                    <li>Documentation review and analysis when applicable</li>
                  </>
                ) : consultant.specialization === 'mental_health' ? (
                  <>
                    <li>Supportive space to discuss your concerns</li>
                    <li>Assessment of your emotional wellbeing</li>
                    <li>Practical coping strategies and tools</li>
                    <li>Personalized guidance for your situation</li>
                    <li>Ongoing support for your emotional journey</li>
                  </>
                ) : (
                  <>
                    <li>Professional assessment of your situation</li>
                    <li>Tailored advice based on your specific needs</li>
                    <li>Practical strategies for moving forward</li>
                    <li>Answers to your most pressing questions</li>
                    <li>Follow-up recommendations when needed</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>Supporting materials and information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <Link to="/resources" className="text-primary hover:underline">
              Visit our resources section
            </Link>
          </div>
          <p className="text-gray-600">
            Peace2Hearts offers a variety of resources related to mental health, 
            legal support, and relationship guidance to complement your consultation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

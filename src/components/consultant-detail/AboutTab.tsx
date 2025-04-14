
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Award, CalendarDays, Clock, Globe } from "lucide-react";

interface AboutTabProps {
  consultant: {
    bio?: string | null;
    qualifications?: string | null;
    experience?: number | null;
    available_days?: string[] | null;
  };
}

export function AboutTab({ consultant }: AboutTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Professional background and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p className="text-gray-600 leading-relaxed">
            {consultant.bio || 
              "This consultant brings a wealth of experience and expertise to help clients navigate complex situations. With a commitment to providing compassionate and effective guidance, they work diligently to help you find peace in your personal relationships and legal matters."}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
          <p className="text-gray-600 leading-relaxed">
            {consultant.qualifications || 
              "Our consultant holds relevant qualifications and certifications in their field, ensuring they can provide professional, knowledgeable guidance tailored to your specific needs."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary/70" />
              Availability
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Days Available</p>
                <p className="text-gray-600">{consultant.available_days?.join(", ") || "Monday - Friday"}</p>
              </div>
              <div>
                <p className="font-medium">Typical Hours</p>
                <p className="text-gray-600">9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary/70" />
              Languages
            </h3>
            <p className="text-gray-600">English</p>
          </div>
        </div>
        
        {consultant.experience && consultant.experience > 0 ? (
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-primary" />
            <span className="text-gray-700 font-medium">{consultant.experience} years of professional experience</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

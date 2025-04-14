
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConsultantHeaderProps {
  consultant: {
    name?: string | null;
    profile_picture_url?: string | null;
    specialization: string;
    experience?: number | null;
    is_available: boolean;
    bio?: string | null;
    available_days?: string[] | null;
  };
  getInitials: () => string;
  formatSpecialization: (specialization: string) => string;
}

export function ConsultantHeader({ consultant, getInitials, formatSpecialization }: ConsultantHeaderProps) {
  // Generate a tagline based on specialization
  const generateTagline = () => {
    if (consultant.specialization === 'legal') {
      return "Helping individuals navigate legal challenges with clarity and care";
    } else if (consultant.specialization === 'mental_health') {
      return "Supporting emotional wellbeing through life's challenging transitions";
    }
    return "Providing expert guidance and support for your journey";
  };

  return (
    <div className="px-6 md:px-10 pb-8">
      <div className="flex flex-col md:flex-row gap-6 -mt-16">
        <Avatar className="h-32 w-32 border-4 border-white bg-white shadow-lg">
          {consultant.profile_picture_url ? (
            <AvatarImage src={consultant.profile_picture_url} alt={consultant.name || "Consultant"} />
          ) : (
            <AvatarFallback className="text-3xl bg-primary/10">{getInitials()}</AvatarFallback>
          )}
        </Avatar>
        <div className="pt-4 md:pt-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-lora">{consultant.name || "Consultant"}</h1>
          <p className="text-lg text-gray-600 mb-4 italic">
            {generateTagline()}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {formatSpecialization(consultant.specialization)}
            </Badge>
            {consultant.experience && consultant.experience > 0 ? (
              <Badge variant="outline" className="text-sm px-3 py-1">
                {consultant.experience} Years Experience
              </Badge>
            ) : null}
            {consultant.is_available ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm px-3 py-1">
                Available
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-sm px-3 py-1">
                Currently Unavailable
              </Badge>
            )}
            <Badge variant="outline" className="text-sm px-3 py-1">
              Virtual Sessions
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span>Virtual Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary/70" />
              <span>{consultant.available_days?.join(", ") || "Flexible schedule"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import required icons
import { MapPin, CalendarDays } from "lucide-react";

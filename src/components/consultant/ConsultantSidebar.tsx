
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Calendar, Clock, Mail, Star } from "lucide-react";
import { ConsultantProfile } from "@/types/ConsultantTypes";
import { formatHours } from "./ConsultantProfileTemplate";

interface ConsultantSidebarProps {
  consultant: ConsultantProfile;
}

const ConsultantSidebar: React.FC<ConsultantSidebarProps> = ({ consultant }) => {
  return (
    <div className="md:col-span-1">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            {consultant.profile_image_url ? (
              <img 
                src={consultant.profile_image_url} 
                alt={consultant.full_name} 
                className="h-32 w-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <span className="text-4xl font-semibold text-purple-600">
                  {consultant.full_name.charAt(0)}
                </span>
              </div>
            )}
            <h1 className="text-xl font-semibold">{consultant.full_name}</h1>
            <p className="text-purple-600 font-medium">
              {consultant.specialization === 'mental-health' 
                ? 'Mental Health' 
                : consultant.specialization === 'legal-support'
                  ? 'Legal Support'
                  : consultant.specialization}
            </p>
            
            {consultant.avg_rating && (
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                <span>{consultant.avg_rating} ({consultant.reviews_count} reviews)</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Award className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Qualifications</h3>
                <p className="text-sm text-gray-600">{consultant.qualifications}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Available Days</h3>
                <p className="text-sm text-gray-600">
                  {consultant.available_days.length > 0 
                    ? consultant.available_days.join(', ') 
                    : 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Working Hours</h3>
                <p className="text-sm text-gray-600">{formatHours(consultant.available_hours)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="text-sm text-gray-600">{consultant.email}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xl font-semibold text-center mb-2">₹{consultant.hourly_rate}/hour</p>
            <Link to={`/book-consultation?consultant=${consultant.id}`}>
              <Button className="w-full" disabled={!consultant.is_available}>
                {consultant.is_available ? "Book Consultation" : "Currently Unavailable"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultantSidebar;


import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Mail, Award, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConsultantProfile {
  id: string;
  full_name: string;
  email: string;
  specialization: string;
  bio: string;
  qualifications: string;
  hourly_rate: number;
  available_days: string[];
  available_hours: string;
  profile_image_url?: string;
  avg_rating?: number;
  reviews_count?: number;
  is_available: boolean;
}

const ConsultantProfileTemplate = () => {
  const { consultantId } = useParams<{ consultantId: string }>();
  const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultantProfile = async () => {
      setIsLoading(true);
      try {
        // Get consultant data by joining profiles and consultants tables
        const { data, error } = await supabase
          .from('consultants')
          .select(`
            id,
            is_available,
            specialization,
            hourly_rate,
            bio,
            qualifications,
            available_days,
            available_hours,
            profiles!inner(
              id,
              full_name,
              email
            )
          `)
          .eq('id', consultantId)
          .single();

        if (error) throw error;
        
        if (data) {
          setConsultant({
            id: data.id,
            full_name: data.profiles.full_name || 'Unnamed Consultant',
            email: data.profiles.email || '',
            specialization: data.specialization,
            bio: data.bio || 'No bio available',
            qualifications: data.qualifications || 'Not specified',
            hourly_rate: data.hourly_rate,
            available_days: data.available_days || [],
            available_hours: data.available_hours || '9:00-17:00',
            is_available: data.is_available,
            avg_rating: 4.8, // Placeholder, would come from ratings table in a full implementation
            reviews_count: 12, // Placeholder, would come from reviews table in a full implementation
          });
        }
      } catch (err) {
        console.error('Error fetching consultant profile:', err);
        setError('Could not load consultant profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (consultantId) {
      fetchConsultantProfile();
    }
  }, [consultantId]);

  // Format the specialization for display
  const formatSpecialization = (spec: string) => {
    if (spec === 'mental-health') return 'Mental Health';
    if (spec === 'legal-support') return 'Legal Support';
    return spec.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format available hours
  const formatHours = (hours: string) => {
    if (hours === '9:00-17:00') return '9:00 AM - 5:00 PM';
    if (hours === '10:00-18:00') return '10:00 AM - 6:00 PM';
    if (hours === '11:00-19:00') return '11:00 AM - 7:00 PM';
    if (hours === '12:00-20:00') return '12:00 PM - 8:00 PM';
    return hours;
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-8 w-3/4 mt-4" />
                <Skeleton className="h-6 w-1/2 mt-2" />
                <Skeleton className="h-6 w-2/3 mt-2" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full mt-4" />
                <Skeleton className="h-6 w-full mt-2" />
                <Skeleton className="h-6 w-full mt-2" />
                <Skeleton className="h-10 w-40 mt-6" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !consultant) {
    return (
      <>
        <Navigation />
        <main className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-semibold mb-4">Consultant Not Found</h1>
            <p>The consultant profile you're looking for could not be found or is not available.</p>
            <Link to="/book-consultation">
              <Button className="mt-8">View Available Consultants</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${consultant.full_name} - ${formatSpecialization(consultant.specialization)} Consultant`}
        description={`${consultant.full_name} is a ${formatSpecialization(consultant.specialization)} consultant at Peace2Hearts. Book a consultation to discuss your needs.`}
        keywords={`${consultant.full_name}, peace2hearts consultant, ${consultant.specialization} counseling, relationship expert`}
      />
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Profile Summary */}
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
                    <p className="text-purple-600 font-medium">{formatSpecialization(consultant.specialization)}</p>
                    
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
                      <Button className="w-full">Book Consultation</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - About & Services */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <div className="prose max-w-none mb-8">
                <p>{consultant.bio}</p>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {consultant.specialization === 'mental-health' ? (
                  <>
                    <Card className="p-4 bg-purple-50">Mental Health Counselling</Card>
                    <Card className="p-4 bg-purple-50">Family Therapy</Card>
                    <Card className="p-4 bg-purple-50">Couples Counselling</Card>
                    <Card className="p-4 bg-purple-50">Premarital Counselling</Card>
                  </>
                ) : (
                  <>
                    <Card className="p-4 bg-purple-50">Divorce Consultation</Card>
                    <Card className="p-4 bg-purple-50">Child Custody Advice</Card>
                    <Card className="p-4 bg-purple-50">Legal Documentation</Card>
                    <Card className="p-4 bg-purple-50">Mediation Services</Card>
                  </>
                )}
              </div>
              
              {!consultant.is_available && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-8">
                  <p className="text-amber-800">
                    This consultant is currently not accepting new appointments.
                  </p>
                </div>
              )}
              
              <Link to={`/book-consultation?consultant=${consultant.id}`}>
                <Button size="lg">Book a Consultation</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantProfileTemplate;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Consultant, getConsultantById } from "@/utils/consultants";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const ConsultantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    const fetchConsultant = async () => {
      try {
        setLoading(true);
        const data = await getConsultantById(id);
        setConsultant(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load consultant details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultant();
  }, [id, toast]);

  if (loading) {
    return (
      <>
        <GoogleAnalytics />
        <SEO 
          title="Loading Consultant Details - Peace2Hearts"
          description="Loading consultant information"
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p>Loading consultant details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <GoogleAnalytics />
        <SEO 
          title="Consultant Not Found - Peace2Hearts"
          description="The requested consultant could not be found"
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Consultant Not Found</h1>
            <p className="mb-6">The consultant you're looking for could not be found.</p>
            <Link to="/services">
              <Button>Browse Our Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Generate consultant initials for avatar fallback
  const getInitials = () => {
    return "CN"; // Default consultant initials
  };

  return (
    <>
      <GoogleAnalytics />
      <SEO 
        title={`Consultant - Peace2Hearts`}
        description={`Learn about our consultant specializing in ${consultant.specialization} at Peace2Hearts.`}
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-peacefulBlue to-softGreen h-32"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-6 -mt-12">
                  <Avatar className="h-24 w-24 border-4 border-white bg-white">
                    {consultant.profile_picture_url ? (
                      <AvatarImage src={consultant.profile_picture_url} alt="Consultant" />
                    ) : (
                      <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="pt-12 sm:pt-0">
                    <h1 className="text-3xl font-bold mb-2">Consultant Profile</h1>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="capitalize">{consultant.specialization.replace('_', ' ')}</Badge>
                      {consultant.is_available ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Available</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Currently Unavailable</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">
                      {consultant.bio || "No bio information available."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Virtual Consultations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <span>{consultant.available_days?.join(", ") || "Flexible schedule"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Expertise</h3>
                        <p className="text-gray-600">{consultant.bio || "This consultant has not provided detailed information about their expertise yet."}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Qualifications</h3>
                        <p className="text-gray-600">{consultant.qualifications || "Qualification details are not available at the moment."}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Hourly Rate</p>
                      <p className="font-semibold text-xl">₹{consultant.hourly_rate}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Available Days</p>
                      <p>{consultant.available_days?.join(", ") || "Contact for availability"}</p>
                    </div>
                    
                    <Link to="/book-consultation" className="block mt-6">
                      <Button className="w-full">Book a Consultation</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantDetail;

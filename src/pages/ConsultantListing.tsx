
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Consultant, getConsultants } from "@/utils/consultants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const ConsultantListing = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        const data = await getConsultants();
        // Only show available consultants
        const availableConsultants = data.filter(consultant => consultant.is_available);
        setConsultants(availableConsultants);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load consultants",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, [toast]);

  // Generate consultant initials for avatar fallback
  const getInitials = () => {
    return "CN"; // Default consultant initials
  };

  // Format specialization for display
  const formatSpecialization = (specialization: string): string => {
    return specialization
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <GoogleAnalytics />
      <SEO 
        title="Our Consultants - Peace2Hearts"
        description="Meet our team of specialized consultants offering legal and mental health support."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Our Consultants</h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Our team of experienced consultants is here to provide you with expert guidance and support
            through your relationship and personal challenges.
          </p>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : consultants.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No consultants available at the moment</h3>
              <p className="text-gray-500">
                Please check back later or contact us for more information.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultants.map((consultant) => (
                <Card key={consultant.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white bg-primary/5">
                        {consultant.profile_picture_url ? (
                          <AvatarImage src={consultant.profile_picture_url} alt="Consultant" />
                        ) : (
                          <AvatarFallback>{getInitials()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">Consultant</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mt-1">
                            {formatSpecialization(consultant.specialization)}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 min-h-[4.5rem]">
                      {consultant.bio || "This consultant specializes in providing expert guidance and support."}
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Hourly Rate:</span>
                        <span className="font-medium">₹{consultant.hourly_rate}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Available:</span>
                        <span className="font-medium">{consultant.available_days?.join(", ") || "Contact for details"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/consultants/${consultant.id}`} className="w-full">
                      <Button variant="outline" className="w-full">View Profile</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantListing;

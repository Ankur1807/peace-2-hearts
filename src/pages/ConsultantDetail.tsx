
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Consultant, getConsultantById } from "@/utils/consultants";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ConsultantDetailWrapper } from "@/components/consultant-detail/ConsultantDetailWrapper";

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

  // Generate consultant initials for avatar fallback
  const getInitials = () => {
    if (!consultant?.name) return "CN";
    return consultant.name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format specialization for better display
  const formatSpecialization = (specialization: string): string => {
    return specialization
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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

  return (
    <>
      <GoogleAnalytics />
      <SEO 
        title={`${consultant.name || 'Consultant'} - Peace2Hearts`}
        description={`Learn about ${consultant.name || 'our consultant'} specializing in ${formatSpecialization(consultant.specialization)} at Peace2Hearts.`}
      />
      <Navigation />
      <main className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <ConsultantDetailWrapper
            consultant={consultant}
            getInitials={getInitials}
            formatSpecialization={formatSpecialization}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantDetail;

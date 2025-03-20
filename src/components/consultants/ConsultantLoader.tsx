
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ConsultantLoaderProps {
  message?: string;
}

const ConsultantLoader = ({ message = "Checking credentials..." }: ConsultantLoaderProps) => {
  return (
    <>
      <SEO 
        title="Loading - Peace2Hearts"
        description="Loading consultant management..."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <p>{message}</p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantLoader;

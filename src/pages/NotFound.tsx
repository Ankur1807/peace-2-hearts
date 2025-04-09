
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <GoogleAnalytics />
      <SEO 
        title="Page Not Found - Peace2Hearts"
        description="The page you are looking for could not be found."
      />
      <Navigation />
      <main className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="section-title text-5xl md:text-7xl mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for cannot be found.</p>
          <Button asChild className="bg-peacefulBlue hover:bg-peacefulBlue/90">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;

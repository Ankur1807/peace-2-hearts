
import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const ConsultantApplicationSuccess = () => {
  return (
    <>
      <SEO 
        title="Application Received - Peace2Hearts"
        description="Your application to join Peace2Hearts as a consultant has been received. We'll review your information and get back to you soon."
        keywords="consultant application, application successful, peace2hearts, consultant"
      />
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Application Received!</h1>
          <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
            <p className="text-lg mb-4">
              Thank you for applying to join Peace2Hearts as a consultant.
            </p>
            <p className="mb-4">
              We've received your application and our team will review your qualifications and professional information. This process typically takes 3-5 business days.
            </p>
            <p className="mb-6">
              Once your application is approved, your consultant profile will be published on our platform and you'll be able to start accepting consultations.
            </p>
            <div className="bg-purple-50 p-4 rounded-md text-purple-800 text-left">
              <p className="font-medium mb-2">What happens next?</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Our team reviews your application</li>
                <li>You'll receive an email with our decision</li>
                <li>If approved, you can immediately start using the consultant dashboard</li>
                <li>Your profile will be visible to clients seeking support</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantApplicationSuccess;

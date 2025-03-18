
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ConsultantApplicationSuccess = () => {
  return (
    <>
      <SEO 
        title="Application Submitted | Peace2Hearts"
        description="Your application to become a Peace2Hearts consultant has been successfully submitted. We'll review your information and get back to you soon."
        keywords="consultant application, Peace2Hearts consultant, relationship counseling career"
      />
      <Navigation />
      <main className="py-16 md:py-20">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <CheckCircle2 className="h-24 w-24 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-lora font-semibold mb-4">Application Submitted!</h1>
          <p className="text-lg mb-8">
            Thank you for your interest in becoming a Peace2Hearts consultant. We've received your application and our team will review it shortly.
          </p>
          
          <div className="bg-slate-50 p-6 rounded-lg mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Our team will review your qualifications and experience</li>
              <li>We may contact you for additional information or to schedule an interview</li>
              <li>Once approved, you'll receive confirmation and can start taking appointments</li>
              <li>Your consultant profile will be published on our platform</li>
            </ol>
          </div>
          
          <p className="mb-8">
            This process typically takes 3-5 business days. If you have any questions in the meantime, please contact us at 
            <a href="mailto:contact@peace2hearts.com" className="text-peacefulBlue hover:underline"> contact@peace2hearts.com</a>.
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/">
              <Button variant="outline" size="lg">Return to Home</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantApplicationSuccess;

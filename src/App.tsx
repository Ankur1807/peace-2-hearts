
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Resources from "./pages/Resources";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";

// Main Service Pages
import MentalHealthService from "./pages/services/MentalHealthService";
import LegalSupportService from "./pages/services/LegalSupportService";

// Mental Health Sub-Services
import MentalHealthCounselling from "./pages/services/mentalhealth/MentalHealthCounselling";
import FamilyTherapy from "./pages/services/mentalhealth/FamilyTherapy";

// Legacy Service Pages
import TherapyService from "./pages/services/TherapyService";
import DivorceService from "./pages/services/DivorceService";
import CustodyService from "./pages/services/CustodyService";

// Legal Sub-Services
import PreMarriageLegal from "./pages/services/legal/PreMarriageLegal";
import DivorceConsultation from "./pages/services/legal/DivorceConsultation";

import BookConsultation from "./pages/BookConsultation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          
          {/* Main Services Route */}
          <Route path="/services" element={<Services />} />
          
          {/* Main Service Category Pages */}
          <Route path="/services/mental-health" element={<MentalHealthService />} />
          <Route path="/services/legal-support" element={<LegalSupportService />} />
          
          {/* Mental Health Sub-Services */}
          <Route path="/services/mental-health/counselling" element={<MentalHealthCounselling />} />
          <Route path="/services/mental-health/family-therapy" element={<FamilyTherapy />} />
          {/* Placeholder routes for remaining mental health sub-services */}
          <Route path="/services/mental-health/premarital-counselling" element={<FamilyTherapy />} />
          <Route path="/services/mental-health/couples-counselling" element={<FamilyTherapy />} />
          <Route path="/services/mental-health/sexual-health-counselling" element={<FamilyTherapy />} />
          
          {/* Legal Sub-Services */}
          <Route path="/services/legal-support/pre-marriage" element={<PreMarriageLegal />} />
          <Route path="/services/legal-support/divorce" element={<DivorceConsultation />} />
          {/* Placeholder routes for remaining legal sub-services */}
          <Route path="/services/legal-support/mediation" element={<PreMarriageLegal />} />
          <Route path="/services/legal-support/custody" element={<DivorceConsultation />} />
          <Route path="/services/legal-support/maintenance" element={<PreMarriageLegal />} />
          <Route path="/services/legal-support/general" element={<DivorceConsultation />} />
          
          {/* Legacy Service Pages - kept for backward compatibility */}
          <Route path="/services/therapy" element={<TherapyService />} />
          <Route path="/services/divorce" element={<DivorceService />} />
          <Route path="/services/custody" element={<CustodyService />} />
          
          <Route path="/resources" element={<Resources />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

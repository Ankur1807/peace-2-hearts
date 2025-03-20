
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import PremaritalCounselling from "./pages/services/mentalhealth/PremaritalCounselling";
import CouplesCounselling from "./pages/services/mentalhealth/CouplesCounselling";
import SexualHealthCounselling from "./pages/services/mentalhealth/SexualHealthCounselling";

// Legal Sub-Services
import PreMarriageLegal from "./pages/services/legal/PreMarriageLegal";
import MediationServices from "./pages/services/legal/MediationServices";
import DivorceConsultation from "./pages/services/legal/DivorceConsultation";
import ChildCustodyConsultation from "./pages/services/legal/ChildCustodyConsultation";
import MaintenanceConsultation from "./pages/services/legal/MaintenanceConsultation";
import GeneralConsultation from "./pages/services/legal/GeneralConsultation";

// Legacy Service Pages
import TherapyService from "./pages/services/TherapyService";
import DivorceService from "./pages/services/DivorceService";
import CustodyService from "./pages/services/CustodyService";

import BookConsultation from "./pages/BookConsultation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ConsultantManagement from "./pages/ConsultantManagement";
import ConsultantListing from "./pages/ConsultantListing";
import ConsultantDetail from "./pages/ConsultantDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
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
            <Route path="/services/mental-health/premarital-counselling" element={<PremaritalCounselling />} />
            <Route path="/services/mental-health/couples-counselling" element={<CouplesCounselling />} />
            <Route path="/services/mental-health/sexual-health-counselling" element={<SexualHealthCounselling />} />
            
            {/* Legal Sub-Services */}
            <Route path="/services/legal-support/pre-marriage" element={<PreMarriageLegal />} />
            <Route path="/services/legal-support/mediation" element={<MediationServices />} />
            <Route path="/services/legal-support/divorce" element={<DivorceConsultation />} />
            <Route path="/services/legal-support/custody" element={<ChildCustodyConsultation />} />
            <Route path="/services/legal-support/maintenance" element={<MaintenanceConsultation />} />
            <Route path="/services/legal-support/general" element={<GeneralConsultation />} />
            
            {/* Legacy Service Pages - kept for backward compatibility */}
            <Route path="/services/therapy" element={<TherapyService />} />
            <Route path="/services/divorce" element={<DivorceService />} />
            <Route path="/services/custody" element={<CustodyService />} />
            
            {/* Consultant Routes */}
            <Route path="/consultants" element={<ConsultantListing />} />
            <Route path="/consultants/:id" element={<ConsultantDetail />} />
            
            <Route path="/resources" element={<Resources />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/consultant-management" element={<ConsultantManagement />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

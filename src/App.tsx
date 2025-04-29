
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from '@/pages/Index';
import About from '@/pages/AboutUs';
import Services from '@/pages/Services';
import BookConsultation from '@/pages/BookConsultation';
import PaymentConfirmation from '@/pages/PaymentConfirmation';
import PaymentVerification from '@/pages/PaymentVerification';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/PrivacyPolicy';
import Refund from '@/pages/CancellationRefund';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import '@/App.css';
import '@/utils/consoleRecovery'; // Import console recovery utilities

// Service pages
import MentalHealthService from '@/pages/services/MentalHealthService';
import LegalSupportService from '@/pages/services/LegalSupportService';
import TherapyService from '@/pages/services/TherapyService';
import DivorceService from '@/pages/services/DivorceService';
import CustodyService from '@/pages/services/CustodyService';

// Mental Health sub-service pages
import MentalHealthCounselling from '@/pages/services/mentalhealth/MentalHealthCounselling';
import CouplesCounselling from '@/pages/services/mentalhealth/CouplesCounselling';
import FamilyTherapy from '@/pages/services/mentalhealth/FamilyTherapy';
import PremaritalCounselling from '@/pages/services/mentalhealth/PremaritalCounselling';
import SexualHealthCounselling from '@/pages/services/mentalhealth/SexualHealthCounselling';

// Legal Support sub-service pages
import MediationServices from '@/pages/services/legal/MediationServices';
import PreMarriageLegal from '@/pages/services/legal/PreMarriageLegal';
import DivorceConsultation from '@/pages/services/legal/DivorceConsultation';
import ChildCustodyConsultation from '@/pages/services/legal/ChildCustodyConsultation';
import MaintenanceConsultation from '@/pages/services/legal/MaintenanceConsultation';
import GeneralConsultation from '@/pages/services/legal/GeneralConsultation';

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';

function App() {
  useEffect(() => {
    // Log that the app is ready
    console.log('Peace2Hearts application initialized');
  }, []);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        
        {/* Main service pages */}
        <Route path="/services/mental-health" element={<MentalHealthService />} />
        <Route path="/services/legal-support" element={<LegalSupportService />} />
        <Route path="/services/therapy" element={<TherapyService />} />
        <Route path="/services/divorce" element={<DivorceService />} />
        <Route path="/services/custody" element={<CustodyService />} />
        
        {/* Mental Health sub-service pages */}
        <Route path="/services/mental-health/counselling" element={<MentalHealthCounselling />} />
        <Route path="/services/mental-health/couples-counselling" element={<CouplesCounselling />} />
        <Route path="/services/mental-health/family-therapy" element={<FamilyTherapy />} />
        <Route path="/services/mental-health/premarital-counselling" element={<PremaritalCounselling />} />
        <Route path="/services/mental-health/sexual-health-counselling" element={<SexualHealthCounselling />} />
        
        {/* Legal Support sub-service pages */}
        <Route path="/services/legal-support/mediation" element={<MediationServices />} />
        <Route path="/services/legal-support/pre-marriage" element={<PreMarriageLegal />} />
        <Route path="/services/legal-support/divorce" element={<DivorceConsultation />} />
        <Route path="/services/legal-support/custody" element={<ChildCustodyConsultation />} />
        <Route path="/services/legal-support/maintenance" element={<MaintenanceConsultation />} />
        <Route path="/services/legal-support/general" element={<GeneralConsultation />} />
        
        <Route path="/book-consultation" element={<BookConsultation />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment-verification" element={<PaymentVerification />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

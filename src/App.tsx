import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Holistic package pages
import PreMarriageClarityPackage from '@/pages/services/holistic/PreMarriageClarityPackage';
import DivorcePreventionPackage from '@/pages/services/holistic/DivorcePreventionPackage';

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminConsultants from '@/pages/admin/AdminConsultants';
import AdminPricing from '@/pages/admin/AdminPricing';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminPaymentMigration from '@/pages/admin/AdminPaymentMigration';

// Other pages
import News from '@/pages/News';
import Consultants from '@/pages/Consultants';
import ConsultantDetail from '@/pages/ConsultantDetail';
import Resources from '@/pages/Resources';
import ShippingDelivery from '@/pages/ShippingDelivery';
import MobileBookings from '@/pages/MobileBookings';
import LogoExport from '@/pages/LogoExport';

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
        
        {/* Holistic package pages */}
        <Route path="/services/holistic/pre-marriage-clarity" element={<PreMarriageClarityPackage />} />
        <Route path="/services/holistic/divorce-prevention" element={<DivorcePreventionPackage />} />
        
        <Route path="/book-consultation" element={<BookConsultation />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment-verification" element={<PaymentVerification />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Other pages */}
        <Route path="/news" element={<News />} />
        <Route path="/consultants" element={<Consultants />} />
        <Route path="/consultants/:id" element={<ConsultantDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/shipping-delivery" element={<ShippingDelivery />} />
        <Route path="/mobile-bookings" element={<MobileBookings />} />
        <Route path="/logo-export" element={<LogoExport />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Protected admin routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="consultants" element={<AdminConsultants />} />
          <Route path="pricing" element={<AdminPricing />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="payment-migration" element={<AdminPaymentMigration />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

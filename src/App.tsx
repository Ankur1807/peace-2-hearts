import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from '@/pages/Index';
import About from '@/pages/AboutUs';
import Services from '@/pages/Services';
import BookConsultation from '@/pages/BookConsultation';
import PaymentConfirmation from '@/pages/PaymentConfirmation';
import PaymentVerification from '@/pages/PaymentVerification';
import ThankYou from '@/pages/ThankYou';
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

// Mental Health sub-service pages
import MentalHealthCounselling from '@/pages/services/mentalhealth/MentalHealthCounselling';
import CouplesCounselling from '@/pages/services/mentalhealth/CouplesCounselling';
import FamilyTherapy from '@/pages/services/mentalhealth/FamilyTherapy';
import SexualHealthCounselling from '@/pages/services/mentalhealth/SexualHealthCounselling';

// Legal Support sub-service pages
import MediationServices from '@/pages/services/legal/MediationServices';
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
import AdminConsultantDetail from '@/pages/admin/ConsultantDetail'; // Renamed to avoid conflict
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

// Import our new AdminServices component
import AdminServices from './pages/admin/AdminServices';

// Add import for the TestSimulation page
import TestSimulation from './pages/TestSimulation';

// Add import for the manual payment test page
import ManualPaymentTest from './pages/ManualPaymentTest';

// Add the EdgeFunctionTest page import
import EdgeFunctionTest from './pages/EdgeFunctionTest';

// Import our new confirmation test page
import ConfirmationTest from './pages/ConfirmationTest';

// Import webhook test pages
import WebhookIntegrationTest from './pages/WebhookIntegrationTest';
import QuickWebhookTest from './pages/QuickWebhookTest';

// App-level flag to prevent multiple recovery runs
let emailRecoveryHasRun = false;

function App() {
  useEffect(() => {
    // Log that the app is ready
    console.log('Peace2Hearts application initialized');
    
    // Only run email recovery once per app load, and only for certain pages
    if (!emailRecoveryHasRun && typeof window !== 'undefined') {
      const path = window.location.pathname;
      
      // Only run on payment-related pages, thank you page, or admin dashboard
      const shouldRunRecovery = 
        path.includes('payment-confirmation') || 
        path.includes('payment-verification') || 
        path.includes('thank-you') ||
        path.includes('/admin');
      
      if (shouldRunRecovery && window.automatedEmailRecovery) {
        console.log('Running automated email recovery from App component...');
        setTimeout(() => {
          window.automatedEmailRecovery();
          emailRecoveryHasRun = true;
        }, 3000);
      }
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          
          {/* Main service pages */}
          <Route path="/services/mental-health" element={<MentalHealthService />} />
          <Route path="/services/legal-support" element={<LegalSupportService />} />
          
          {/* 301 Redirects for removed standalone pages */}
          <Route path="/services/therapy" element={<Navigate to="/services/mental-health/couples-counselling" replace />} />
          <Route path="/services/divorce" element={<Navigate to="/services/legal-support/divorce" replace />} />
          <Route path="/services/custody" element={<Navigate to="/services/legal-support/custody" replace />} />
          
          {/* Mental Health sub-service pages */}
          <Route path="/services/mental-health/counselling" element={<MentalHealthCounselling />} />
          <Route path="/services/mental-health/couples-counselling" element={<CouplesCounselling />} />
          <Route path="/services/mental-health/family-therapy" element={<FamilyTherapy />} />
          <Route path="/services/mental-health/sexual-health-counselling" element={<SexualHealthCounselling />} />
          
          {/* Legal Support sub-service pages */}
          <Route path="/services/legal-support/mediation" element={<MediationServices />} />
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
          <Route path="/thank-you" element={<ThankYou />} />
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
          
          {/* Admin routes - Login should stand alone without AdminProvider */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Protected admin routes with AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="consultants" element={<AdminConsultants />} />
            <Route path="consultants/:id" element={<AdminConsultantDetail />} />
            <Route path="pricing" element={<AdminPricing />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="payment-migration" element={<AdminPaymentMigration />} />
          </Route>
          
          {/* Add the TestSimulation route to your router configuration */}
          <Route path="/test-simulation" element={<TestSimulation />} />
          
          {/* Add the manual payment test route */}
          <Route path="/manual-payment-test" element={<ManualPaymentTest />} />
          
          {/* Add the EdgeFunctionTest route */}
          <Route path="/edge-function-test" element={<EdgeFunctionTest />} />
          
          {/* Add our new confirmation test route */}
          <Route path="/confirmation-test" element={<ConfirmationTest />} />
          
          {/* Add webhook test routes */}
          <Route path="/webhook-integration-test" element={<WebhookIntegrationTest />} />
          <Route path="/quick-webhook-test" element={<QuickWebhookTest />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

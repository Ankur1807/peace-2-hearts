import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import BookConsultation from './pages/BookConsultation';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationRefund from './pages/CancellationRefund';
import ShippingDelivery from './pages/ShippingDelivery';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentVerification from './pages/PaymentVerification';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import ConsultantListing from './pages/ConsultantListing';
import ConsultantDetail from './pages/ConsultantDetail';
import Services from './pages/Services';
import MobileBookings from './pages/MobileBookings';
import LogoExport from './pages/LogoExport';
import { Toaster } from "@/components/ui/toaster";

// Admin pages
import PaymentSystemMigration from './pages/admin/PaymentSystemMigration';

// Update the routes array to include our new pages
const routes = [
  <Route path="/" element={<Index />} />,
  <Route path="/book-consultation" element={<BookConsultation />} />,
  <Route path="/contact" element={<Contact />} />,
  <Route path="/about" element={<AboutUs />} />,
  <Route path="/terms" element={<Terms />} />,
  <Route path="/privacy-policy" element={<PrivacyPolicy />} />,
  <Route path="/cancellation-refund" element={<CancellationRefund />} />,
  <Route path="/shipping-delivery" element={<ShippingDelivery />} />,
  <Route path="/payment-confirmation" element={<PaymentConfirmation />} />,
  <Route path="/payment-verification" element={<PaymentVerification />} />,
  <Route path="/dashboard" element={<Dashboard />} />,
  <Route path="/consultants" element={<ConsultantListing />} />,
  <Route path="/consultants/:id" element={<ConsultantDetail />} />,
  <Route path="/services" element={<Services />} />,
  <Route path="/mobile-bookings" element={<MobileBookings />} />,
  <Route path="/logo-export" element={<LogoExport />} />,
  
  // Admin Routes
  <Route path="/admin/payment-migration" element={<PaymentSystemMigration />} />,
  
  // 404 route - should be the last one
  <Route path="*" element={<NotFound />} />
];

function App() {
  return (
    <Router>
      <Routes>
        {routes}
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

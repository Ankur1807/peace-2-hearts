import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookConsultation from './pages/BookConsultation';
import Contact from './pages/Contact';
import About from './pages/About';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CancellationRefund from './pages/CancellationRefund';
import ShippingDelivery from './pages/ShippingDelivery';
import PaymentConfirmation from './pages/PaymentConfirmation';
import PaymentVerification from './pages/PaymentVerification';
import BookingSuccess from './pages/BookingSuccess';
import BookingHistory from './pages/BookingHistory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Admin pages
import PaymentSystemMigration from './pages/admin/PaymentSystemMigration';

function App() {
  const { toast } = useToast()

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-consultation" element={<BookConsultation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cancellation-refund" element={<CancellationRefund />} />
        <Route path="/shipping-delivery" element={<ShippingDelivery />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment-verification" element={<PaymentVerification />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        
        {/* Admin Routes */}
        <Route path="/admin/payment-migration" element={<PaymentSystemMigration />} />
        
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

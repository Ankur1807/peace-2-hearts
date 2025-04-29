
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
        <Route path="/book-consultation" element={<BookConsultation />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route path="/payment-verification" element={<PaymentVerification />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

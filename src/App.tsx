import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SEO } from './components/SEO';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme/theme-provider';
import { AdminProvider } from './hooks/useAdminContext';
import Index from './pages/Index';
import BookConsultation from './pages/BookConsultation';
import PaymentConfirmation from './pages/PaymentConfirmation';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminBookings from './pages/admin/AdminBookings';
import AdminConsultants from './pages/admin/AdminConsultants';
import AdminServices from './pages/admin/AdminServices';
import AdminPricing from './pages/admin/AdminPricing';
import AdminPaymentMigration from './pages/admin/AdminPaymentMigration';
import AdminSettings from './pages/admin/AdminSettings';

// Import the new PricingAudit page
import PricingAudit from './pages/admin/PricingAudit';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SEO title="Peace2Hearts" />
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/consultants" element={<AdminConsultants />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />
            <Route path="/admin/pricing/audit" element={<PricingAudit />} />
            <Route path="/admin/migration" element={<AdminPaymentMigration />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
          </Routes>
        </Router>
      </AdminProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import CircuitHeartLogo from './navigation/CircuitHeartLogo';
import { useIsMobile } from '../hooks/use-mobile';

const Footer = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="pt-12 pb-6 w-full relative overflow-hidden" style={{ backgroundColor: 'rgba(14, 165, 233, 1)' }}>
      {/* Wavey background for footer */}
      <svg className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 80C240 100 480 40 720 40C960 40 1200 100 1440 90V400H0V80Z" fill="url(#footer-wave1)" fillOpacity="0.15"/>
        <path d="M0 150C240 120 480 180 720 150C960 120 1200 150 1440 140V400H0V150Z" fill="url(#footer-wave2)" fillOpacity="0.1"/>
        <defs>
          <linearGradient id="footer-wave1" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6"/>
            <stop offset="1" stopColor="#0EA5E9"/>
          </linearGradient>
          <linearGradient id="footer-wave2" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F9A8D4"/>
            <stop offset="1" stopColor="#20BDBE"/>
          </linearGradient>
        </defs>
      </svg>

      <div className={`container mx-auto relative z-10 ${isMobile ? 'text-center' : ''}`}>
        {/* Conditional header based on mobile/desktop */}
        {isMobile ? (
          // Mobile: Full width frame with pink/teal gradient
          <div className="w-full mb-10 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-b from-softPink via-[#20BDBE] to-peacefulBlue p-6">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center mb-4">
                  {/* Logo with translucent backdrop */}
                  <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 shadow-xl">
                    <CircuitHeartLogo size="lg" textColor="text-white" className="footer-heartbeat-glow" />
                  </div>
                </div>
                <div className="text-white">
                  <h3 className="font-lora text-xl font-semibold mb-2">Helping you find peace,</h3>
                  <p className="text-white/90 text-lg">with or without love.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop: Simple logo with translucent box and tagline
          <div className="flex items-center mb-10 gap-6">
            <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 shadow-xl">
              <CircuitHeartLogo size="lg" textColor="text-white" className="footer-heartbeat-glow" />
            </div>
            <div className="text-white">
              <h3 className="font-lora text-xl font-semibold mb-1">Helping you find peace,</h3>
              <p className="text-white/90">with or without love.</p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 ${isMobile ? 'md:grid-cols-4' : 'md:grid-cols-4'} gap-8 mb-8`}>
          {/* First column - tagline */}
          <div>
            <p className="text-white/90 mb-4 ml-1">
              Your emotional well-being matters—let's explore solutions together.
            </p>
          </div>
          
          {/* Quick Links column */}
          <div>
            <h3 className="font-lora text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-white/90 hover:text-white">About Us</Link></li>
              <li><Link to="/services" className="text-white/90 hover:text-white">Our Services</Link></li>
              <li><Link to="/contact" className="text-white/90 hover:text-white">Contact Us</Link></li>
              <li><Link to="/terms" className="text-white/90 hover:text-white">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-white/90 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Services column */}
          <div>
            <h3 className="font-lora text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services/mental-health" className="text-white/90 hover:text-white">Mental Health Support</Link></li>
              <li><Link to="/services/legal-support" className="text-white/90 hover:text-white">Legal Consultations</Link></li>
              <li><Link to="/services/therapy" className="text-white/90 hover:text-white">Relationship Therapy</Link></li>
              <li><Link to="/services/divorce" className="text-white/90 hover:text-white">Divorce Guidance</Link></li>
              <li><Link to="/services/custody" className="text-white/90 hover:text-white">Custody Support</Link></li>
            </ul>
          </div>
          
          {/* Contact Us column */}
          <div>
            <h3 className="font-lora text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white mt-0.5" />
                <span className="text-white/90">134 N Block, Main Road, Mohan Nagar, Bhondsi, Gurgaon – 122102</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white" />
                <span className="text-white/90">+91 7428564364</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white" />
                <span className="text-white/90">support@peace2hearts.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6 mb-4">
          <div className="bg-white/10 rounded-lg p-4 text-white/80 text-xs text-center">
            <p>
              Peace2Hearts provides informational content only and does not offer legal, psychological, or medical advice. We do not endorse consultants, and users should seek independent professional guidance. If you are in crisis or feeling suicidal, please contact a suicide prevention helpline.
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-6">
          <p className="text-center text-white/80 text-sm">
            &copy; {new Date().getFullYear()} Peace2Hearts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

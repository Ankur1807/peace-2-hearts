
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">About</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/services/mental-health" className="text-gray-300 hover:text-white transition-colors">
              Mental Health Support
            </Link>
          </li>
          <li>
            <Link to="/services/legal-support" className="text-gray-300 hover:text-white transition-colors">
              Legal Consultation
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">News</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/news" className="text-gray-300 hover:text-white transition-colors">
              News & Updates
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
        <ul className="space-y-2">
          <li>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/cancellation-refund" className="text-gray-300 hover:text-white transition-colors">
              Cancellation & Refund
            </Link>
          </li>
          <li>
            <Link to="/shipping-delivery" className="text-gray-300 hover:text-white transition-colors">
              Shipping & Delivery
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;

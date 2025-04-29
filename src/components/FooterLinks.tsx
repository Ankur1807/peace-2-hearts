
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About Us</Link></li>
          <li><Link to="/services" className="hover:underline">Services</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Our Services</h3>
        <ul className="space-y-2">
          <li><Link to="/services/mental-health" className="hover:underline">Mental Health Support</Link></li>
          <li><Link to="/services/legal-support" className="hover:underline">Legal Support</Link></li>
          <li><Link to="/services/therapy" className="hover:underline">Relationship Therapy</Link></li>
          <li><Link to="/services/divorce" className="hover:underline">Divorce Support</Link></li>
          <li><Link to="/services/custody" className="hover:underline">Child Custody Support</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Legal</h3>
        <ul className="space-y-2">
          <li><Link to="/terms" className="hover:underline">Terms & Conditions</Link></li>
          <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          <li><Link to="/refund" className="hover:underline">Cancellation & Refund</Link></li>
          <li><Link to="/admin/login" className="hover:underline text-xs text-gray-400">Admin Portal</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default FooterLinks;

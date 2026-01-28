import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Phone, Mail, HelpCircle, Truck, ChevronDown } from 'lucide-react';

const TopBar = () => {
  const [branding, setBranding] = useState({ 
    phone: '+91 98765 43210', 
    contact_email: 'support@mystore.com' 
  });

  useEffect(() => {
    const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
    const fetchBranding = async () => {
      try {
        const res = await api.get(`/websites/${websiteId}`); // Dynamic ID
        setBranding(res.data);
      } catch (error) {
        console.error("Failed to fetch topbar data");
      }
    };
    fetchBranding();
  }, []);

  return (
    <div className="hidden md:block bg-teal-900 text-teal-50 text-[11px] font-medium tracking-wide">
      <div className="container mx-auto px-4 h-10 flex justify-between items-center">
        
        {/* Left Side: Contact & Track */}
        <div className="flex items-center gap-6">
          <a href={`tel:${branding.phone}`} className="flex items-center gap-2 hover:text-teal-200 transition-colors opacity-90 hover:opacity-100">
            <Phone className="w-3.5 h-3.5" />
            <span>{branding.phone}</span>
          </a>
          <a href={`mailto:${branding.contact_email}`} className="hidden sm:flex items-center gap-2 hover:text-teal-200 transition-colors opacity-90 hover:opacity-100">
            <Mail className="w-3.5 h-3.5" />
            <span>{branding.contact_email}</span>
          </a>
        </div>

        {/* Center: Promo (Optional, hidden on small screens) */}
        <div className="hidden lg:block text-teal-200">
          Fast shipping across all locations! Need help? Call us now.
        </div>

        {/* Right Side: Utilities */}
        <div className="flex items-center gap-5">
          
          <Link to="/track" className="flex items-center gap-1.5 hover:text-white transition-colors opacity-90 hover:opacity-100">
            <Truck className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </Link>
          <Link to="/faq" className="flex items-center gap-1.5 hover:text-white transition-colors opacity-90 hover:opacity-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>
          
          {/* Socials Divider */}
          <div className="h-3 w-px bg-teal-700 mx-1 hidden md:block"></div>

          {/* Currency / Language Selectors */}
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <span>USD</span>
                <ChevronDown className="w-3 h-3" />
             </div>
             <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                <span>English</span>
                <ChevronDown className="w-3 h-3" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;
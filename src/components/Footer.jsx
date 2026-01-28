import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Mail, Phone, MapPin, ArrowRight, Printer, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
    const [branding, setBranding] = useState({
        name: 'PrintNova',
        contact_email: 'support@mystore.com',
        contact_address: '123 Tech Park, CA',
        phone: '+91 98765 43210'
    });

    useEffect(() => {
        const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
        const fetchBranding = async () => {
            try {
                const res = await api.get(`/websites/${websiteId}`);
                setBranding(res.data);
            } catch (error) {
                console.error("Failed to fetch footer branding");
            }
        };
        fetchBranding();
    }, []);

    return (
        <footer className="bg-[#0a0f12] text-gray-400 pt-24 pb-12 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

            <div className="container mx-auto px-4 relative z-10">
                
                {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-20 border-b border-white/5">
                    <div className="max-w-md">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-6 transition-transform">
                                {branding.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-3xl font-black text-white tracking-tighter">{branding.name}<span className="text-teal-500">.</span></span>
                        </Link>
                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
                            Empowering your physical vision with next-generation printing technology. From home setups to industrial solutions.
                        </p>
                    </div>

                    <div className="w-full lg:w-[450px]">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                            <Zap size={14} className="text-teal-500" /> Stay Updated
                        </h4>
                        <div className="relative group">
                            <input 
                                type="email" 
                                placeholder="Enter your business email" 
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl text-white outline-none focus:border-teal-500 focus:bg-white/10 transition-all placeholder:text-gray-600"
                            />
                            <button className="absolute right-2 top-2 bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-2xl transition-all shadow-lg shadow-teal-900/20 active:scale-95">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-600 mt-3 ml-2 font-bold uppercase tracking-wider">Join 5,000+ professionals receiving tech insights weekly.</p>
                    </div>
                </div>

                {/* --- MIDDLE SECTION: QUICK LINKS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20">
                    <FooterLinkSet title="Shop" links={[
                        { label: 'All Printers', to: '/products' },
                        { label: 'New Arrivals', to: '/products?filter=new' },
                        { label: 'Special Deals', to: '/products?filter=deals' },
                        { label: '3D Printing', to: '/products?category=3d-printers' }
                    ]} />
                    
                    <FooterLinkSet title="Support" links={[
                        { label: 'Help Center', to: '/faq' },
                        { label: 'Track Order', to: '/track' },
                        { label: 'Contact Us', to: '/contact' },
                        { label: 'Troubleshooting', to: '/troubleshooting' }
                    ]} />

                    <FooterLinkSet title="Legal" links={[
                        { label: 'Privacy Policy', to: '/pages/privacy' },
                        { label: 'Terms of Use', to: '/pages/terms' },
                        { label: 'Shipping Info', to: '/pages/shipping' },
                        { label: 'Refund Policy', to: '/pages/refund' }
                    ]} />

                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">Direct Contact</h4>
                        <ul className="space-y-6">
                            <ContactItem icon={<Phone size={18} />} val={branding.phone} sub="Direct Support Line" />
                            <ContactItem icon={<Mail size={18} />} val={branding.contact_email} sub="Email Inquiries" />
                            <ContactItem icon={<MapPin size={18} />} val={branding.contact_address} sub="Headquarters" />
                        </ul>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: COPYRIGHT & SUBSIDIARY --- */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                            © 2026 {branding.name}. All rights reserved.
                        </p>
                        <div className="hidden md:block w-1 h-1 bg-gray-800 rounded-full"></div>
                        <p className="text-xs font-medium text-gray-500">
                            A subsidiary of <span className="text-teal-600 font-black">PrimeFix Solutions LLC</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-8 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                    </div>
                </div>

            </div>
        </footer>
    );
};

const FooterLinkSet = ({ title, links }) => (
    <div>
        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">{title}</h4>
        <ul className="space-y-4">
            {links.map((link, i) => (
                <li key={i}>
                    <Link to={link.to} className="text-sm font-medium hover:text-teal-500 transition-colors">
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const ContactItem = ({ icon, val, sub }) => (
    <li className="flex items-start gap-4 group cursor-default">
        <div className="mt-1 text-teal-600 group-hover:text-teal-400 transition-colors">{icon}</div>
        <div>
            <p className="text-sm font-bold text-gray-300">{val}</p>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">{sub}</p>
        </div>
    </li>
);

export default Footer;

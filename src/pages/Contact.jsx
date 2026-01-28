import React, { useState, useEffect } from 'react';
import api from '../api/api';
import SEO from '../components/SEO';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [branding, setBranding] = useState({
    contact_email: 'support@mystore.com',
    contact_address: '123 Tech Park, CA',
    phone: '+91 98765 43210'
  });

  useEffect(() => {
    const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
    const fetchBranding = async () => {
      try {
        const res = await api.get(`/websites/${websiteId}`); // Dynamic ID
        setBranding(res.data);
      } catch (error) {
        console.error("Failed to fetch contact branding");
      }
    };
    fetchBranding();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website_id: import.meta.env.VITE_WEBSITE_ID || 1 // Dynamic ID
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', website_id: import.meta.env.VITE_WEBSITE_ID || 1 });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <SEO 
        pageName="contact" 
        fallbackTitle="Contact Us | Support & Help" 
        fallbackDesc="Get in touch with our expert team." 
      />
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Have questions about our printers or need technical support? We're here to help.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-4"><Mail size={24} /></div>
                <h3 className="font-bold text-gray-900 mb-1 text-xs uppercase tracking-widest">Email Us</h3>
                <p className="text-sm text-gray-500 font-medium">{branding.contact_email}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4"><Phone size={24} /></div>
                <h3 className="font-bold text-gray-900 mb-1 text-xs uppercase tracking-widest">Call Us</h3>
                <p className="text-sm text-gray-500 font-medium">{branding.phone}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4"><MapPin size={24} /></div>
                <h3 className="font-bold text-gray-900 mb-1 text-xs uppercase tracking-widest">Visit Us</h3>
                <p className="text-sm text-gray-500 font-medium">{branding.contact_address}</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
            {success ? (
                <div className="py-20 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                    <p className="text-gray-500 mb-8">We've received your query and will get back to you shortly.</p>
                    <button onClick={() => setSuccess(false)} className="text-teal-600 font-bold hover:underline">Send another message</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">Full Name</label>
                            <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">Email Address</label>
                            <input type="email" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">Phone Number</label>
                            <input type="tel" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" placeholder="+1..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">Subject</label>
                        <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" placeholder="Support Request" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest">Message</label>
                        <textarea rows="5" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" placeholder="How can we help?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>
                    <button 
                        disabled={loading}
                        className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center gap-2 group shadow-lg shadow-teal-900/10 disabled:bg-gray-300"
                    >
                        {loading ? 'Sending...' : 'Send Message'} 
                        {!loading && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAdmin } from '../context/AdminContext';
import { Globe, Mail, MapPin, Image as ImageIcon, Save, Loader2, AlertCircle, Zap } from 'lucide-react';

const AdminBranding = () => {
    const { selectedWebsiteId, fetchWebsites } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        logo_url: '',
        favicon_url: '',
        contact_email: '',
        contact_address: '',
        phone: '',
        smtp_host: '',
        smtp_port: '',
        smtp_user: '',
        smtp_pass: '',
        smtp_secure: true,
        from_email: ''
    });

    useEffect(() => {
        if (selectedWebsiteId) {
            loadBranding();
        }
    }, [selectedWebsiteId]);

    const loadBranding = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/websites/admin/${selectedWebsiteId}`);
            setFormData({
                name: res.data.name || '',
                url: res.data.url || '',
                logo_url: res.data.logo_url || '',
                favicon_url: res.data.favicon_url || '',
                contact_email: res.data.contact_email || '',
                contact_address: res.data.contact_address || '',
                phone: res.data.phone || '',
                smtp_host: res.data.smtp_host || '',
                smtp_port: res.data.smtp_port || '',
                smtp_user: res.data.smtp_user || '',
                smtp_pass: res.data.smtp_pass || '',
                smtp_secure: res.data.smtp_secure === 1,
                from_email: res.data.from_email || ''
            });
        } catch (error) {
            console.error("Failed to load branding data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/websites/${selectedWebsiteId}`, formData);
            alert("Branding updated successfully!");
            fetchWebsites(); // Refresh global list
        } catch (error) {
            alert("Failed to update branding");
        } finally {
            setSaving(false);
        }
    };

    if (!selectedWebsiteId) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                <Globe size={48} className="text-gray-200 mb-4" />
                <h2 className="text-xl font-bold text-gray-900">No Website Selected</h2>
                <p className="text-gray-500 mt-2">Please select a website from the header to manage its branding.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Website Branding</h1>
                <p className="text-gray-500 text-sm">Customize how this storefront looks and how customers reach you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Visual Identity */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <ImageIcon className="text-teal-600" /> Visual Identity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Brand Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold text-gray-800"
                                placeholder="e.g. My Awesome Store"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Website URL</label>
                            <input 
                                type="url" 
                                required
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                                placeholder="https://store-a.com"
                                value={formData.url}
                                onChange={e => setFormData({...formData, url: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Logo URL</label>
                            <input 
                                type="text" 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                                placeholder="/logo.png or https://..."
                                value={formData.logo_url}
                                onChange={e => setFormData({...formData, logo_url: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Favicon URL (.ico or .png)</label>
                            <input 
                                type="text" 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                                placeholder="/favicon.ico or https://..."
                                value={formData.favicon_url}
                                onChange={e => setFormData({...formData, favicon_url: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    {/* ... existing contact section ... */}
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Mail className="text-teal-600" /> Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Customer Support Email</label>
                            <input 
                                type="email" 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all"
                                placeholder="support@store.com"
                                value={formData.contact_email}
                                onChange={e => setFormData({...formData, contact_email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Support Phone Number</label>
                            <input 
                                type="text" 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Physical Address</label>
                            <textarea 
                                rows="2"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all"
                                placeholder="123 Store St, City, Country"
                                value={formData.contact_address}
                                onChange={e => setFormData({...formData, contact_address: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Email Server (SMTP) */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Zap className="text-teal-600" /> Email Server (SMTP)
                        </h2>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-[10px] font-black uppercase text-gray-400">SSL/TLS Security</span>
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 text-teal-600" 
                                checked={formData.smtp_secure}
                                onChange={e => setFormData({...formData, smtp_secure: e.target.checked})}
                            />
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">SMTP Host</label>
                            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white" placeholder="smtp.gmail.com" value={formData.smtp_host} onChange={e => setFormData({...formData, smtp_host: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">SMTP Port</label>
                            <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white" placeholder="465" value={formData.smtp_port} onChange={e => setFormData({...formData, smtp_port: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">SMTP Username</label>
                            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white" placeholder="your-email@gmail.com" value={formData.smtp_user} onChange={e => setFormData({...formData, smtp_user: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">SMTP Password / App Key</label>
                            <input type="password" placeholder="••••••••••••" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white" value={formData.smtp_pass} onChange={e => setFormData({...formData, smtp_pass: e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">"From" Email Address</label>
                            <input type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white" placeholder="PrintNova <noreply@printnova.shop>" value={formData.from_email} onChange={e => setFormData({...formData, from_email: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        disabled={saving}
                        className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-600 transition-all shadow-xl hover:shadow-teal-900/20 disabled:bg-gray-200"
                    >
                        {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                        Save Branding
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AdminBranding;

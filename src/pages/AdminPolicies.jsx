import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useAdmin } from '../context/AdminContext';
import api from '../api/api';
import { FileText, Save, Loader2, ShieldAlert, Truck, RotateCcw, FileSignature, Globe } from 'lucide-react';

const AdminPolicies = () => {
    const { selectedWebsiteId } = useAdmin();
    const [activeTab, setActiveTab] = useState('privacy');
    const [content, setContent] = useState('');
    const [seo, setSeo] = useState({ meta_title: '', meta_description: '', meta_keywords: '' });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [allPolicies, setAllPolicies] = useState({});

    const tabs = [
        { id: 'privacy', label: 'Privacy Policy', icon: ShieldAlert },
        { id: 'terms', label: 'Terms & Conditions', icon: FileSignature },
        { id: 'refund', label: 'Refund Policy', icon: RotateCcw },
        { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    ];

    useEffect(() => {
        if (selectedWebsiteId) {
            fetchPolicies();
        }
    }, [selectedWebsiteId]);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const res = await api.get('/policies', { params: { website_id: selectedWebsiteId } });
            setAllPolicies(res.data);
            const current = res.data[activeTab] || { content: '', meta_title: '', meta_description: '', meta_keywords: '' };
            setContent(current.content || '');
            setSeo({
                meta_title: current.meta_title || '',
                meta_description: current.meta_description || '',
                meta_keywords: current.meta_keywords || ''
            });
        } catch (error) {
            console.error("Failed to fetch policies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const current = allPolicies[activeTab] || { content: '', meta_title: '', meta_description: '', meta_keywords: '' };
        setContent(current.content || '');
        setSeo({
            meta_title: current.meta_title || '',
            meta_description: current.meta_description || '',
            meta_keywords: current.meta_keywords || ''
        });
    }, [activeTab, allPolicies]);

    const handleSave = async () => {
        if (!selectedWebsiteId) {
            alert("Please select a website first from the header.");
            return;
        }
        setSaving(true);
        try {
            await api.post('/policies', {
                website_id: selectedWebsiteId,
                type: activeTab,
                content: content,
                ...seo
            });
            // Update local state
            setAllPolicies({ ...allPolicies, [activeTab]: { content, ...seo } });
            alert('Policy updated successfully');
        } catch (error) {
            alert('Failed to save policy');
        } finally {
            setSaving(false);
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Website Policies</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage legal pages for the selected storefront</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving || !selectedWebsiteId}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-teal-900/20 disabled:bg-gray-200"
                >
                    {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                    Save {tabs.find(t => t.id === activeTab).label}
                </button>
            </div>

            {!selectedWebsiteId && (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl text-orange-700 mb-8 flex items-center gap-4">
                    <ShieldAlert size={32} />
                    <div>
                        <p className="font-bold">No Website Selected</p>
                        <p className="text-sm">Please select a specific website from the top header dropdown to manage its policies.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white text-teal-600 shadow-sm border border-gray-100' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-8">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400 font-bold italic">
                            Fetching policy content...
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <FileText className="text-teal-600" />
                                Edit {tabs.find(t => t.id === activeTab).label}
                            </h2>
                            <div className="flex-1 min-h-[400px]">
                                <ReactQuill 
                                    theme="snow" 
                                    value={content} 
                                    onChange={setContent}
                                    modules={modules}
                                    className="h-[350px] mb-12"
                                />
                            </div>

                            {/* SEO Settings for Policy */}
                            <div className="border-t pt-8 mt-12">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe className="text-teal-600 w-5 h-5" /> SEO Settings for this Policy
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Title</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                                            value={seo.meta_title}
                                            onChange={e => setSeo({...seo, meta_title: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Description</label>
                                        <textarea 
                                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm h-24"
                                            value={seo.meta_description}
                                            onChange={e => setSeo({...seo, meta_description: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Keywords</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                                            value={seo.meta_keywords}
                                            onChange={e => setSeo({...seo, meta_keywords: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPolicies;

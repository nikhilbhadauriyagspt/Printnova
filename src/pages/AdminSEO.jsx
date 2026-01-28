import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAdmin } from '../context/AdminContext';
import { Search, Save, Globe, Package, Tag, FileText, HelpCircle, Layout } from 'lucide-react';

const AdminSEO = () => {
    const { selectedWebsiteId } = useAdmin();
    const [activeTab, setActiveTab] = useState('static'); // static, products, categories, policies, faqs
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { id: 'static', label: 'Static Pages', icon: Layout },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'policies', label: 'Policies', icon: FileText },
        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    ];

    useEffect(() => {
        fetchItems();
    }, [activeTab, selectedWebsiteId]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'static') res = await api.get('/seo', { params: { website_id: selectedWebsiteId || 1 } });
            else if (activeTab === 'products') res = await api.get('/products');
            else if (activeTab === 'categories') res = await api.get('/categories');
            else if (activeTab === 'policies') {
                const pRes = await api.get('/policies', { params: { website_id: selectedWebsiteId || 1 } });
                // Policies are returned as an object { privacy: {meta...}, terms: {...} }
                // Convert to array for the list
                const pArray = Object.keys(pRes.data).map(key => ({
                    id: key,
                    name: key.toUpperCase() + ' POLICY',
                    ...pRes.data[key]
                }));
                setItems(pArray);
                setSelectedItem(pArray[0]);
                setLoading(false);
                return;
            }
            else if (activeTab === 'faqs') res = await api.get('/faqs', { params: { website_id: selectedWebsiteId || 1 } });

            setItems(res.data);
            if (res.data.length > 0) setSelectedItem(res.data[0]);
            else setSelectedItem(null);
        } catch (error) {
            console.error("Failed to fetch items");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === 'static') {
                await api.put('/seo', { ...selectedItem, website_id: selectedWebsiteId || 1 });
            } else if (activeTab === 'products') {
                await api.put(`/products/${selectedItem.id}`, selectedItem);
            } else if (activeTab === 'categories') {
                await api.put(`/categories/${selectedItem.id}`, selectedItem);
            } else if (activeTab === 'policies') {
                await api.post('/policies', {
                    website_id: selectedWebsiteId || 1,
                    type: selectedItem.id,
                    content: selectedItem.content,
                    meta_title: selectedItem.meta_title,
                    meta_description: selectedItem.meta_description,
                    meta_keywords: selectedItem.meta_keywords
                });
            } else if (activeTab === 'faqs') {
                await api.put(`/faqs/${selectedItem.id}`, selectedItem);
            }
            alert('SEO updated successfully');
        } catch (error) {
            alert('Update failed');
        }
    };

    const filteredItems = items.filter(item => 
        (item.name || item.page_name || item.question || item.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Centralized SEO Manager</h1>
                    <p className="text-gray-500 text-sm">Manage meta tags for everything from one place.</p>
                </div>
                
                {/* Tab Switcher */}
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                                : 'text-gray-400 hover:text-teal-600 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Search & List */}
                <div className="space-y-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-teal-500 outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    </div>
                    
                    <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <p className="text-center py-10 text-gray-400 text-xs italic">Loading...</p>
                        ) : filteredItems.map(item => (
                            <button 
                                key={item.id || item.page_name}
                                onClick={() => setSelectedItem(item)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider truncate ${
                                    (selectedItem?.id === item.id || selectedItem?.page_name === item.page_name)
                                    ? 'bg-teal-50 text-teal-700 border border-teal-100' 
                                    : 'text-gray-500 hover:bg-white border border-transparent'
                                }`}
                            >
                                {item.name || item.page_name?.replace('_', ' ') || item.question || item.id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Form */}
                <div className="md:col-span-3">
                    {selectedItem ? (
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Globe className="text-teal-600 w-5 h-5" /> 
                                Meta Tags for <span className="text-teal-600 uppercase">"{selectedItem.name || selectedItem.page_name?.replace('_', ' ') || 'Item'}"</span>
                            </h2>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all"
                                        value={selectedItem.meta_title || ''}
                                        onChange={e => setSelectedItem({...selectedItem, meta_title: e.target.value})}
                                        placeholder="SEO Title (recommended 50-60 characters)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Description</label>
                                    <textarea 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all h-32"
                                        value={selectedItem.meta_description || ''}
                                        onChange={e => setSelectedItem({...selectedItem, meta_description: e.target.value})}
                                        placeholder="Brief description for Google results (recommended 150-160 characters)"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Keywords</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all"
                                        value={selectedItem.meta_keywords || ''}
                                        onChange={e => setSelectedItem({...selectedItem, meta_keywords: e.target.value})}
                                        placeholder="Comma separated keywords"
                                    />
                                </div>
                                <button className="flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20">
                                    <Save size={18} /> Update SEO Settings
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 font-bold italic py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                            Select an item from the left to manage its SEO.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSEO;

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import api from '../api/api';
import { Plus, Trash2, Edit, HelpCircle, Save, X, Loader2 } from 'lucide-react';

const AdminFaqs = () => {
    const { selectedWebsiteId } = useAdmin();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({ 
        question: '', 
        answer: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    const fetchFaqs = async () => {
        if (!selectedWebsiteId) return;
        setLoading(true);
        try {
            const res = await api.get('/faqs', { params: { website_id: selectedWebsiteId } });
            setFaqs(res.data);
        } catch (error) {
            console.error("Failed to fetch FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, [selectedWebsiteId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFaq) {
                await api.put(`/faqs/${editingFaq.id}`, formData);
            } else {
                await api.post('/faqs', { ...formData, website_id: selectedWebsiteId });
            }
            setIsModalOpen(false);
            setFormData({ question: '', answer: '' });
            fetchFaqs();
        } catch (error) {
            alert("Action failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/faqs/${id}`);
            fetchFaqs();
        } catch (error) {
            alert("Failed to delete FAQ");
        }
    };

    const openEditModal = (faq) => {
        setEditingFaq(faq);
        setFormData({ 
            question: faq.question, 
            answer: faq.answer,
            meta_title: faq.meta_title || '',
            meta_description: faq.meta_description || '',
            meta_keywords: faq.meta_keywords || ''
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingFaq(null);
        setFormData({ 
            question: '', 
            answer: '',
            meta_title: '',
            meta_description: '',
            meta_keywords: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 text-sm tracking-tight">Frequently Asked Questions</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage help content for storefront visitors</p>
                </div>
                <button 
                    onClick={openAddModal}
                    disabled={!selectedWebsiteId}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-900/20 disabled:bg-gray-200 transition-all"
                >
                    <Plus size={18} /> Add FAQ
                </button>
            </div>

            {!selectedWebsiteId && (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-[32px] text-orange-700 mb-8 flex items-center gap-4">
                    <HelpCircle size={32} />
                    <div>
                        <p className="font-bold">Website Not Selected</p>
                        <p className="text-sm text-orange-600">Please select a specific storefront from the top header to manage its FAQs.</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-bold italic">Loading FAQs...</div>
                ) : faqs.length > 0 ? (
                    faqs.map((faq) => (
                        <div key={faq.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-start gap-3">
                                        <span className="text-teal-500 mt-1">Q.</span>
                                        {faq.question}
                                    </h3>
                                    <div className="text-gray-500 text-sm leading-relaxed pl-8 flex items-start gap-3">
                                        <span className="font-bold text-gray-300">A.</span>
                                        {faq.answer}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <HelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium font-bold">No FAQs found for this website.</p>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-900">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Question</label>
                                <textarea 
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all text-gray-800 font-bold"
                                    placeholder="e.g. What is your return policy?"
                                    rows="2"
                                    value={formData.question}
                                    onChange={e => setFormData({...formData, question: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Answer</label>
                                <textarea 
                                    required
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all text-gray-600"
                                    placeholder="Type the answer here..."
                                    rows="5"
                                    value={formData.answer}
                                    onChange={e => setFormData({...formData, answer: e.target.value})}
                                />
                            </div>

                            {/* SEO Section */}
                            <div className="border-t pt-6 space-y-4">
                                <h3 className="font-bold text-gray-900 text-sm">SEO Settings (Optional)</h3>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Meta Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-xs"
                                        value={formData.meta_title}
                                        onChange={e => setFormData({...formData, meta_title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Meta Description</label>
                                    <textarea 
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-xs h-20"
                                        value={formData.meta_description}
                                        onChange={e => setFormData({...formData, meta_description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Meta Keywords</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-xs"
                                        value={formData.meta_keywords}
                                        onChange={e => setFormData({...formData, meta_keywords: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-900/20 transition-all">
                                    {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFaqs;

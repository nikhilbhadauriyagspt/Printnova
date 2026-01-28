import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit, X, Save, FileText, Image as ImageIcon } from 'lucide-react';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        image_url: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBlog) await api.put(`/blogs/${editingBlog.id}`, formData);
            else await api.post('/blogs', formData);
            setIsModalOpen(false);
            fetchBlogs();
        } catch (error) {
            alert("Save failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this article?")) return;
        try {
            await api.delete(`/blogs/${id}`);
            fetchBlogs();
        } catch (error) {
            alert("Delete failed");
        }
    };

    const openModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({ ...blog });
        } else {
            setEditingBlog(null);
            setFormData({ title: '', description: '', content: '', image_url: '', meta_title: '', meta_description: '', meta_keywords: '' });
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tech Insights Manager</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage articles and resources for the Home page.</p>
                </div>
                <button onClick={() => openModal()} className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-teal-900/20 transition-all">
                    <Plus size={18} /> New Article
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                            {blog.image_url ? (
                                <img src={blog.image_url} alt="" className="w-full h-full object-cover" />
                            ) : <ImageIcon size={40} className="text-gray-300" />}
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-gray-900 mb-2 truncate">{blog.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-6">{blog.description}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(blog.created_at).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-black text-gray-900">{editingBlog ? 'Edit Article' : 'New Article'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Article Title</label>
                                    <input required type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Short Description</label>
                                    <textarea required rows="2" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Image URL</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Main Content (HTML/Text)</label>
                                    <textarea rows="6" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                                </div>

                                {/* SEO Section */}
                                <div className="md:col-span-2 border-t pt-6">
                                    <h3 className="font-bold text-gray-900 mb-4">SEO Settings</h3>
                                    <div className="space-y-4">
                                        <input placeholder="Meta Title" type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={formData.meta_title || ''} onChange={e => setFormData({...formData, meta_title: e.target.value})} />
                                        <textarea placeholder="Meta Description" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={formData.meta_description || ''} onChange={e => setFormData({...formData, meta_description: e.target.value})} />
                                        <input placeholder="Meta Keywords" type="text" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl" value={formData.meta_keywords || ''} onChange={e => setFormData({...formData, meta_keywords: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-900/20">Save Article</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogs;

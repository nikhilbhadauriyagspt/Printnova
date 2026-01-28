import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Tag, FolderTree, X, ImageIcon, Edit } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', 
        image: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setFormData({
            name: cat.name,
            image: cat.image || '',
            meta_title: cat.meta_title || '',
            meta_description: cat.meta_description || '',
            meta_keywords: cat.meta_keywords || ''
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            setFormData({ name: '', image: '', meta_title: '', meta_description: '', meta_keywords: '' });
            setShowForm(false);
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            alert('Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This might affect products linked to this category.')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert('Failed to delete category');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-gray-500 text-sm mt-1">Organize your products</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'Add Category'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Form Section */}
                {showForm && (
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-teal-600" />
                                {editingId ? 'Edit Category' : 'New Category'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 3D Printers" 
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                                    <input 
                                        type="text" 
                                        placeholder="image.png" 
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                                        value={formData.image}
                                        onChange={e => setFormData({...formData, image: e.target.value})}
                                    />
                                </div>
                                
                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-bold text-gray-800 mb-3">SEO (Optional)</h3>
                                    <div className="space-y-3">
                                        <input 
                                            type="text" placeholder="Meta Title" 
                                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                                            value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})}
                                        />
                                        <textarea 
                                            placeholder="Meta Description" 
                                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg h-20"
                                            value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})}
                                        ></textarea>
                                        <input 
                                            type="text" placeholder="Meta Keywords" 
                                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                                            value={formData.meta_keywords} onChange={e => setFormData({...formData, meta_keywords: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                                    {editingId ? 'Update Category' : 'Create Category'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* List Section */}
                <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="p-4">Icon</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Slug</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : categories.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                                {cat.image ? (
                                                    <img src={cat.image.startsWith('http') ? cat.image : `/category/${cat.image}`} alt="" className="w-full h-full object-cover rounded-lg" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                                                ) : (
                                                    <FolderTree className="w-5 h-5" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">{cat.name}</td>
                                        <td className="p-4 text-sm text-gray-400">/{cat.slug}</td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors mr-1"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminCategories;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Edit, Trash2, Search, X, Check, Image as ImageIcon } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const initialFormState = {
        name: '',
        slug: '',
        description: '',
        price: '',
        mrp: '',
        stock: 100,
        low_stock_threshold: 10,
        image_url: '',
        category_id: '',
        is_featured: false,
        is_best_selling: false,
        status: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Assuming we have a categories endpoint. If not, we might need to add it or use raw query.
            // But usually /api/products returns category_name. 
            // We need a list for the dropdown.
            // Let's assume /api/categories exists or creates it? 
            // Wait, we don't have a category controller specifically for fetching ALL list yet exposed cleanly.
            // Actually, we imported category data. We should have a route.
            // I'll check/create category routes quickly after this if needed. 
            // For now, I'll try /api/categories assuming I might need to make it.
            // Wait, I haven't made category routes yet! I'll fix that.
            // For now, let's just proceed assuming I will make it.
            const res = await api.get('/categories'); 
            setCategories(res.data);
        } catch (error) {
            console.warn("Categories endpoint might not be ready", error);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug || '',
            description: product.description || '',
            price: product.price,
            mrp: product.mrp || '',
            stock: product.stock,
            low_stock_threshold: product.low_stock_threshold || 10,
            image_url: product.image_url || '',
            category_id: product.category_id || '',
            is_featured: !!product.is_featured,
            is_best_selling: !!product.is_best_selling,
            status: !!product.status,
            meta_title: product.meta_title || '',
            meta_description: product.meta_description || '',
            meta_keywords: product.meta_keywords || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            alert('Operation failed');
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your catalog</p>
                </div>
                <button onClick={openAddModal} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {p.image_url ? (
                                                <img src={p.image_url.startsWith('http') ? p.image_url : `/products/${p.image_url}`} alt="" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-sm line-clamp-1 w-64" title={p.name}>{p.name}</p>
                                            <p className="text-xs text-gray-400">ID: {p.id}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{p.category_name || 'N/A'}</td>
                                    <td className="p-4 text-sm font-bold text-gray-800">${p.price}</td>
                                    <td className="p-4 text-sm text-gray-600">{p.stock}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {p.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openEditModal(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                                    <input type="text" required className="w-full p-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                                    <input type="number" step="0.01" required className="w-full p-2 border rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">MRP ($)</label>
                                    <input type="number" step="0.01" className="w-full p-2 border rounded-lg" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                    <select className="w-full p-2 border rounded-lg" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Low Stock Threshold</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" value={formData.low_stock_threshold} onChange={e => setFormData({...formData, low_stock_threshold: e.target.value})} />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                                    <input type="text" className="w-full p-2 border rounded-lg" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="http://... or image.png" />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                    <textarea className="w-full p-2 border rounded-lg h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                </div>

                                {/* SEO Section */}
                                <div className="col-span-2 border-t pt-4 mt-2">
                                    <h3 className="font-bold text-gray-800 mb-4">SEO Settings</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
                                            <textarea className="w-full p-2 border rounded-lg h-20" value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})}></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Meta Keywords</label>
                                            <input type="text" className="w-full p-2 border rounded-lg" value={formData.meta_keywords} onChange={e => setFormData({...formData, meta_keywords: e.target.value})} placeholder="comma, separated, keywords" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 flex gap-6 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" checked={formData.status} onChange={e => setFormData({...formData, status: e.target.checked})} />
                                        <span className="text-sm font-medium">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                                        <span className="text-sm font-medium">Featured</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" checked={formData.is_best_selling} onChange={e => setFormData({...formData, is_best_selling: e.target.checked})} />
                                        <span className="text-sm font-medium">Best Selling</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Ticket, X, Calendar, DollarSign, Percent } from 'lucide-react';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase: 0,
        expiry_date: '',
        is_active: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await api.get('/coupons');
            setCoupons(res.data);
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/coupons', formData);
            setFormData({ code: '', discount_type: 'percentage', discount_value: '', min_purchase: 0, expiry_date: '', is_active: true });
            setShowForm(false);
            fetchCoupons();
        } catch (error) {
            alert('Failed to add coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/coupons/${id}`);
            fetchCoupons();
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Coupons & Discounts</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage promotional codes</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'Add Coupon'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {showForm && (
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-teal-600" /> New Coupon
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                                    <input type="text" placeholder="E.g. SUMMER10" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-teal-500" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                    <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                                    <input type="number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase ($)</label>
                                    <input type="number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={formData.min_purchase} onChange={e => setFormData({...formData, min_purchase: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input type="date" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} />
                                </div>
                                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors">Create Coupon</button>
                            </form>
                        </div>
                    </div>
                )}

                <div className={`${showForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Discount</th>
                                    <th className="p-4">Min Purchase</th>
                                    <th className="p-4">Expiry</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center">Loading...</td></tr>
                                ) : coupons.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-black text-teal-600">{c.code}</td>
                                        <td className="p-4 text-sm font-bold text-gray-800">
                                            {c.discount_type === 'percentage' ? `${c.discount_value}%` : `$${c.discount_value}`}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">${c.min_purchase}</td>
                                        <td className="p-4 text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar size={14} /> {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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

export default AdminCoupons;

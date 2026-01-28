import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import api from '../api/api'; 
import { Package, Globe, Clock, MapPin, X, User, CreditCard, ShoppingBag, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminOrders = () => {
    const { selectedWebsiteId } = useAdmin();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/admin', {
                params: { website_id: selectedWebsiteId }
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [selectedWebsiteId]);

    const viewOrderDetails = async (id) => {
        setModalLoading(true);
        setShowModal(true);
        try {
            const res = await api.get(`/orders/admin/${id}`);
            setSelectedOrder(res.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
            alert("Failed to load order details");
            setShowModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/orders/admin/${id}/status`, { status: newStatus });
            fetchOrders();
            // Refresh modal data
            const res = await api.get(`/orders/admin/${id}`);
            setSelectedOrder(res.data);
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {selectedWebsiteId ? 'Managing orders for selected storefront' : 'Global order view'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-5 border-b border-gray-100">Order ID</th>
                                <th className="p-5 border-b border-gray-100">Customer</th>
                                {!selectedWebsiteId && <th className="p-5 border-b border-gray-100">Website</th>}
                                <th className="p-5 border-b border-gray-100">Total</th>
                                <th className="p-5 border-b border-gray-100">Status</th>
                                <th className="p-5 border-b border-gray-100">Date</th>
                                <th className="p-5 border-b border-gray-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                            ) : orders.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-5">
                                        <span className="font-bold text-gray-700">#{o.id}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{o.display_name}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {o.shipping_address ? o.shipping_address.substring(0, 25) + '...' : 'N/A'}
                                        </div>
                                    </td>
                                    {!selectedWebsiteId && (
                                        <td className="p-5">
                                            {o.website_name ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-medium">
                                                    <Globe className="w-3 h-3" /> {o.website_name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Unknown</span>
                                            )}
                                        </td>
                                    )}
                                    <td className="p-5 text-gray-900 font-bold">
                                        ${Number(o.total_amount).toFixed(2)}
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                            o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <button 
                                            onClick={() => viewOrderDetails(o.id)}
                                            className="bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && orders.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-400">
                                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ORDER DETAILS MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-up">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Order Details #{selectedOrder?.id}</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Status: <span className="text-teal-600">{selectedOrder?.status}</span></p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {modalLoading ? (
                                <div className="py-20 text-center text-gray-400 font-bold">Loading information...</div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    
                                    {/* Left: Info Cards */}
                                    <div className="lg:col-span-1 space-y-6">
                                        {/* Customer */}
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                                <User size={14} className="text-teal-500" /> Customer
                                            </div>
                                            <p className="font-bold text-gray-900">{selectedOrder?.customer_name}</p>
                                            <p className="text-sm text-gray-500">{selectedOrder?.customer_email}</p>
                                            <p className="text-sm text-gray-500">{selectedOrder?.guest_phone || 'N/A'}</p>
                                        </div>

                                        {/* Shipping */}
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                                <MapPin size={14} className="text-teal-500" /> Shipping Address
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">{selectedOrder?.shipping_address}</p>
                                        </div>

                                        {/* Payment */}
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-4">
                                                <CreditCard size={14} className="text-teal-500" /> Payment
                                            </div>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-bold text-gray-900">{selectedOrder?.payment_method}</span>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${selectedOrder?.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {selectedOrder?.payment_status}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black text-teal-600">${Number(selectedOrder?.total_amount).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    {/* Right: Items List */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                                            <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-400">
                                                <ShoppingBag size={14} className="text-teal-500" /> Ordered Items
                                            </div>
                                            <div className="divide-y divide-gray-50">
                                                {selectedOrder?.items?.map(item => (
                                                    <div key={item.id} className="p-5 flex items-center gap-4 group">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden border border-gray-100">
                                                            <img 
                                                                src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`) : 'https://via.placeholder.com/100'} 
                                                                alt="" 
                                                                className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" 
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-gray-900 truncate">{item.product_name}</p>
                                                            <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} &bull; ${Number(item.price).toFixed(2)} each</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action: Update Status */}
                                        <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div>
                                                <p className="text-teal-900 font-bold">Update Order Status</p>
                                                <p className="text-xs text-teal-600 font-medium">Notify customer about order progress</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => updateStatus(selectedOrder?.id, 'shipped')} className="bg-white hover:bg-teal-600 hover:text-white text-teal-700 px-4 py-2 rounded-xl text-xs font-black transition-all border border-teal-200 uppercase">Shipped</button>
                                                <button onClick={() => updateStatus(selectedOrder?.id, 'out_for_delivery')} className="bg-white hover:bg-orange-600 hover:text-white text-orange-700 px-4 py-2 rounded-xl text-xs font-black transition-all border border-orange-200 uppercase">Out for Delivery</button>
                                                <button onClick={() => updateStatus(selectedOrder?.id, 'delivered')} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-teal-900/20 uppercase">Delivered</button>
                                                <button onClick={() => updateStatus(selectedOrder?.id, 'cancelled')} className="bg-white hover:bg-red-600 hover:text-white text-red-700 px-4 py-2 rounded-xl text-xs font-black transition-all border border-red-200 uppercase">Cancel</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;

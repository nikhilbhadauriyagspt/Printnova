import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../api/api';
import { Search, Package, MapPin, Clock, Truck, CheckCircle2, ShieldCheck, ArrowRight, X, Zap } from 'lucide-react';

const TrackOrder = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialId = queryParams.get('id') || '';

    const [orderId, setOrderId] = useState(initialId);
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const res = await api.post('/orders/track', { order_id: orderId, email: email });
            setOrder(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Order not found. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialId) setOrderId(initialId);
    }, [initialId]);

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h1>
                    <p className="text-gray-500 max-w-md mx-auto">Enter your Order ID and the Email used during checkout to see the latest status of your shipment.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 mb-12">
                    <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Order ID</label>
                            <div className="relative">
                                <Package className="absolute left-4 top-4 text-teal-500 w-5 h-5" />
                                <input 
                                    type="text" required placeholder="e.g. 123"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold"
                                    value={orderId} onChange={e => setOrderId(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-4 text-teal-500 w-5 h-5" />
                                <input 
                                    type="email" required placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-bold"
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <button 
                                disabled={loading}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-200"
                            >
                                {loading ? 'Searching...' : 'Track Order'}
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-500 text-sm font-bold mt-6 text-center">{error}</p>}
                </div>

                {order && (
                    <div className="animate-fade-in space-y-8">
                        <div className="bg-teal-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="text-center md:text-left">
                                    <p className="text-teal-300 font-bold text-xs uppercase tracking-widest mb-2">Current Status</p>
                                    <h2 className="text-4xl font-black capitalize tracking-tight">{order.status.replace(/_/g, ' ')}</h2>
                                    <p className="text-teal-100 mt-2 text-sm opacity-80">Order #{order.id} &bull; Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <Truck size={40} className="text-teal-300" />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                        </div>

                        <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                            {order.status === 'cancelled' ? (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <X size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Order Cancelled</h3>
                                    <p className="text-gray-500 text-sm">This order was cancelled and is no longer being processed.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative">
                                    <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-gray-100 z-0"></div>
                                    <StatusStep label="Confirmed" active={true} completed={true} icon={<CheckCircle2 size={20} />} />
                                    <StatusStep label="Shipped" active={['shipped', 'out_for_delivery', 'delivered'].includes(order.status)} completed={['shipped', 'out_for_delivery', 'delivered'].includes(order.status)} icon={<Truck size={20} />} />
                                    <StatusStep label="Out for Delivery" active={['out_for_delivery', 'delivered'].includes(order.status)} completed={['out_for_delivery', 'delivered'].includes(order.status)} icon={<Zap size={20} />} />
                                    <StatusStep label="Delivered" active={order.status === 'delivered'} completed={order.status === 'delivered'} icon={<Package size={20} />} />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                                    <MapPin className="text-teal-500" size={16} /> Delivery Address
                                </h3>
                                <p className="text-gray-600 leading-relaxed font-medium">{order.shipping_address}</p>
                            </div>
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                                    <ShieldCheck className="text-teal-500" size={16} /> Payment Info
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-medium">{order.payment_method}</span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                                <p className="text-2xl font-black text-gray-900 mt-2">${Number(order.total_amount).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusStep = ({ label, active, completed, icon }) => (
    <div className="flex items-center gap-4 md:flex-col md:text-center md:gap-3 relative z-10 flex-1 w-full md:w-auto">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
            active ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'bg-gray-100 text-gray-300'
        } ${completed && active ? 'ring-4 ring-teal-50' : ''}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${active ? 'text-teal-600' : 'text-gray-300'}`}>{label}</span>
    </div>
);

export default TrackOrder;
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ShoppingBag, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/user');
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Please log in to view your order history.</p>
                    <Link to="/login" className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-all">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order History</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and track your recent purchases.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-bold italic">Loading your orders...</div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                            <Package size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                            <h3 className="font-bold text-gray-900 text-xl">#ORD-{order.id}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                    <Clock size={14} className="text-teal-500" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                                    order.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                                                    order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 border-gray-50 pt-6 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                            <p className="font-black text-gray-900 text-xl">${Number(order.total_amount).toFixed(2)}</p>
                                        </div>
                                        <Link to={`/track?id=${order.id}`} className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center group-hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-900/20">
                                            <ChevronRight size={24} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 md:p-20 rounded-[40px] border border-gray-100 shadow-sm text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-8">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No orders yet</h2>
                        <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Start exploring our premium collection of printers and place your first order today.</p>
                        <Link to="/products" className="inline-flex items-center gap-3 bg-teal-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20">
                            <Search size={18} /> Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
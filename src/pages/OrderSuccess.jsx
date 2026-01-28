import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { generateInvoice } from '../utils/invoiceGenerator';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag, Clock, MapPin, Copy, Check, Truck, ShieldCheck, FileText } from 'lucide-react';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const orderId = location.state?.orderId;

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const res = await api.get(`/orders/public/${orderId}`);
                setOrder(res.data);
            } catch (error) {
                console.error("Error fetching order info", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(orderId.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-500 font-bold">Generating your receipt...</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-2xl">
                
                <div className="bg-white rounded-[48px] shadow-xl shadow-teal-900/5 border border-gray-100 overflow-hidden relative">
                    {/* Top Accent */}
                    <div className="h-3 bg-teal-500 w-full"></div>
                    
                    <div className="p-8 md:p-16 text-center">
                        <img src="/order-success.jpg" alt="Order Success" className="w-48 h-48 object-cover mx-auto mb-8 rounded-3xl" />
                        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={40} className="animate-pulse" />
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">Order Confirmed!</h1>
                        <p className="text-gray-500 mb-10 font-medium">Thank you, <span className="text-teal-600 font-bold">{order?.customer_name}</span>. Your order has been placed successfully.</p>

                        {/* Order ID Card */}
                        <div className="bg-gray-900 rounded-3xl p-6 mb-12 relative overflow-hidden group">
                            <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Order Identification</p>
                            <div className="flex items-center justify-center gap-4">
                                <h2 className="text-4xl font-black text-white tracking-tighter">#ORD-{orderId}</h2>
                                <button 
                                    onClick={copyToClipboard}
                                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all active:scale-90"
                                    title="Copy Order ID"
                                >
                                    {copied ? <Check size={18} className="text-teal-400" /> : <Copy size={18} />}
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        </div>

                        {/* Receipt Details */}
                        <div className="text-left space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Clock size={12} className="text-teal-500" /> Date & Payment
                                    </p>
                                    <p className="text-sm font-bold text-gray-800">{new Date(order?.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-xs text-gray-500 mt-1">{order?.payment_method} &bull; <span className="capitalize">{order?.payment_status}</span></p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <MapPin size={12} className="text-teal-500" /> Shipping To
                                    </p>
                                    <p className="text-sm font-bold text-gray-800 leading-relaxed">{order?.shipping_address}</p>
                                </div>
                            </div>

                            {/* Summary Table */}
                            <div className="border-t border-dashed border-gray-200 pt-8">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Order Summary</p>
                                <div className="space-y-4">
                                    {order?.items?.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center p-1">
                                                    <img src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`) : 'https://via.placeholder.com/50'} className="max-h-full object-contain mix-blend-multiply" alt="" />
                                                </div>
                                                <span className="text-gray-600 font-medium truncate max-w-[180px] md:max-w-[250px]">{item.product_name} <span className="text-gray-300 font-black ml-1">x{item.quantity}</span></span>
                                            </div>
                                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-gray-50 my-2"></div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-900 font-black text-xl">Amount Paid</span>
                                        <span className="text-teal-600 font-black text-2xl">${Number(order?.total_amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-16 flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => generateInvoice(order)}
                                className="flex-1 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10"
                            >
                                <FileText size={18} /> Download Invoice
                            </button>
                            <Link to="/track" state={{ id: orderId }} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10">
                                <Truck size={18} /> Track Shipment
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center space-y-4">
                    <p className="text-gray-400 text-xs font-medium">A confirmation receipt has been sent to your email.</p>
                    <div className="flex items-center justify-center gap-2 text-gray-300">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified Secure Transaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;

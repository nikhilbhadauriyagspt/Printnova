import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CreditCard, Truck, ShieldCheck, User, MapPin, ArrowLeft, ShoppingBag, Zap, Tag, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        payment_method: ''
    });

    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0 && !orderPlaced) {
            navigate('/cart');
        }
        
        // Fetch payment settings
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
                // Set default payment method based on what's enabled
                if (res.data.cod_enabled === '1') setFormData(prev => ({...prev, payment_method: 'COD'}));
                else if (res.data.paypal_enabled === '1') setFormData(prev => ({...prev, payment_method: 'PayPal'}));
            } catch (error) {
                console.error("Failed to load payment settings");
            }
        };

        const fetchCoupons = async () => {
            try {
                const res = await api.get('/coupons/public');
                setAvailableCoupons(res.data);
            } catch (error) {
                console.error("Failed to fetch coupons");
            }
        };

        fetchSettings();
        fetchCoupons();
    }, [cartItems.length, navigate, orderPlaced]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async (codeOverride = null) => {
        const codeToUse = codeOverride || couponCode;
        if (!codeToUse) return;

        try {
            const res = await api.post('/coupons/validate', { 
                code: codeToUse, 
                cartTotal: getCartTotal() 
            });
            setDiscount(res.data.discountAmount);
            setAppliedCoupon(res.data.code);
            setCouponCode(res.data.code);
            toast.success(`Coupon ${res.data.code} applied!`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid coupon code");
        }
    };

    const placeOrder = async (paypalDetails = null) => {
        setLoading(true);
        try {
            const orderData = {
                user_id: user?.id || null,
                guest_name: formData.name,
                guest_email: formData.email,
                guest_phone: formData.phone,
                shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
                payment_method: formData.payment_method,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total_amount: total,
                website_id: import.meta.env.VITE_WEBSITE_ID || 1 // Dynamic ID
            };

            const res = await api.post('/orders', orderData);
            setOrderPlaced(true);
            clearCart();
            navigate('/order-success', { state: { orderId: res.data.orderId || res.data.order_id } });
        } catch (error) {
            console.error("Order Failed:", error.response?.data || error);
            toast.error("Failed to place order: " + (error.response?.data?.error || "Please try again."));
        } finally {
            setLoading(false);
        }
    };

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 20;
    const total = subtotal + shipping - discount;

    if (!settings) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Loading checkout...</div>;

    const paypalClientId = settings.paypal_mode === 'live' ? settings.paypal_live_client_id : settings.paypal_sandbox_client_id;

    return (
        <PayPalScriptProvider options={{ 
            "client-id": paypalClientId || "test",
            "currency": "USD", 
            "intent": "capture"
        }}>
            <div className="bg-gray-50 min-h-screen py-8 md:py-12 pb-32 md:pb-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-gray-200 hover:text-teal-600 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
                        
                        <div className="flex-1 space-y-6 md:space-y-8">
                            {/* Customer Details */}
                            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="text-teal-600 w-5 h-5" /> Customer Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                        <input type="text" name="name" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" value={formData.name} onChange={handleInputChange} disabled={!!user} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                        <input type="email" name="email" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" value={formData.email} onChange={handleInputChange} disabled={!!user} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                        <input type="tel" name="phone" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <MapPin className="text-teal-600 w-5 h-5" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Street Address</label>
                                        <input type="text" name="address" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                        <input type="text" name="city" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" value={formData.city} onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">ZIP Code</label>
                                        <input type="text" name="zip" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all" value={formData.zip} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="text-teal-600 w-5 h-5" /> Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {settings.cod_enabled === '1' && (
                                        <label className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.payment_method === 'COD' ? 'border-teal-600 bg-teal-50/30' : 'border-gray-50 hover:border-gray-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <input type="radio" name="payment_method" value="COD" checked={formData.payment_method === 'COD'} onChange={handleInputChange} className="w-5 h-5 text-teal-600" />
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm md:text-base">Cash on Delivery</p>
                                                    <p className="text-[10px] md:text-xs text-gray-500">Pay at your doorstep</p>
                                                </div>
                                            </div>
                                            <Truck className="text-teal-600 w-6 h-6 opacity-20" />
                                        </label>
                                    )}

                                    {settings.paypal_enabled === '1' && (
                                        <label className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.payment_method === 'PayPal' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 hover:border-gray-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <input type="radio" name="payment_method" value="PayPal" checked={formData.payment_method === 'PayPal'} onChange={handleInputChange} className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm md:text-base">PayPal / Cards</p>
                                                    <p className="text-[10px] md:text-xs text-gray-500">Fast and secure global payments</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-40">
                                                <div className="w-8 h-5 bg-blue-600 rounded-sm"></div>
                                                <div className="w-8 h-5 bg-sky-400 rounded-sm"></div>
                                            </div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-96">
                            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Review</h2>
                                
                                {/* Coupon Section */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Discount Coupon</label>
                                    <div className="flex gap-2 mb-4">
                                        <input 
                                            type="text" 
                                            placeholder="Enter code" 
                                            className="flex-1 p-3 bg-white border border-gray-200 rounded-xl focus:border-teal-500 outline-none transition-all text-sm uppercase font-bold"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={!!appliedCoupon}
                                        />
                                        <button 
                                            onClick={() => handleApplyCoupon()}
                                            disabled={!couponCode || !!appliedCoupon}
                                            className="px-4 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 disabled:bg-gray-200 transition-all"
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {/* Available Coupons List */}
                                    {availableCoupons.length > 0 && !appliedCoupon && (
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <Tag size={10} /> Available Offers:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {availableCoupons.map(coupon => (
                                                    <button 
                                                        key={coupon.code}
                                                        onClick={() => handleApplyCoupon(coupon.code)}
                                                        className="px-3 py-2 bg-white text-teal-700 border border-teal-100 rounded-xl text-[10px] font-black hover:bg-teal-50 transition-all flex items-center gap-2 group shadow-sm"
                                                    >
                                                        <span>{coupon.code}</span>
                                                        <span className="w-1 h-1 bg-teal-200 rounded-full"></span>
                                                        <span className="text-[8px] font-bold opacity-60">
                                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value} OFF`}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {appliedCoupon && (
                                        <div className="flex items-center justify-between bg-teal-100/50 p-3 rounded-xl border border-teal-200">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center text-white">
                                                    <Check size={14} />
                                                </div>
                                                <p className="text-[10px] text-teal-800 font-black uppercase tracking-tight">Coupon {appliedCoupon} Applied!</p>
                                            </div>
                                            <button onClick={() => { setAppliedCoupon(''); setDiscount(0); setCouponCode(''); }} className="text-teal-700 hover:text-red-600 font-bold text-[10px] uppercase underline underline-offset-4">Remove</button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-gray-500 truncate flex-1 pr-4">{item.name} <span className="font-bold text-gray-400 ml-1">x{item.quantity}</span></span>
                                            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-gray-50 my-4"></div>
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Shipping</span>
                                        <span className="font-bold text-gray-900">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-teal-600 text-sm">
                                            <span>Discount</span>
                                            <span className="font-bold">-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-black text-gray-900 pt-2 border-t border-gray-50 mt-4">
                                        <span>Total</span>
                                        <span className="text-teal-600 text-2xl font-black">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Desktop Order Buttons */}
                                <div className="hidden md:block">
                                    {formData.payment_method === 'COD' ? (
                                        <button 
                                            disabled={loading || !formData.address || !formData.phone}
                                            onClick={() => placeOrder()}
                                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            {loading ? 'Processing...' : 'Complete Purchase'}
                                        </button>
                                    ) : (
                                        <div className="relative z-0">
                                            <PayPalButtons 
                                                disabled={!formData.address || !formData.phone}
                                                style={{ layout: "vertical", shape: "pill", label: "pay" }}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [{ amount: { value: total.toFixed(2) } }]
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order.capture().then((details) => {
                                                        placeOrder(details);
                                                    });
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <ShieldCheck size={16} className="text-teal-500" />
                                    Secure SSL Checkout
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 p-4 z-[50] flex items-center gap-4 animate-fade-in-up shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
                <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">To Pay</p>
                    <p className="text-xl font-black text-teal-600">${total.toFixed(2)}</p>
                </div>
                <div className="flex-[2]">
                    {formData.payment_method === 'COD' ? (
                        <button 
                            disabled={loading || !formData.address || !formData.phone}
                            onClick={() => placeOrder()}
                            className="w-full bg-gray-900 text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-gray-900/20 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            {loading ? '...' : 'Place Order'}
                        </button>
                    ) : (
                        <div className="relative z-0 max-h-12 overflow-hidden rounded-xl">
                            <PayPalButtons 
                                disabled={!formData.address || !formData.phone}
                                style={{ layout: "horizontal", height: 48, shape: "rect", label: "pay", tagline: false }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{ amount: { value: total.toFixed(2) } }]
                                    });
                                }}
                                onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                        placeOrder(details);
                                    });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PayPalScriptProvider>
    );
};

export default Checkout;
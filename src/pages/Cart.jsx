import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, ShoppingCart } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 20;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6">
                    <ShoppingBag size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Explore our wide range of products and find something you like.</p>
                <Link to="/products" className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-gray-200 hover:text-teal-600 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Items List */}
                    <div className="flex-1 space-y-4 pb-24 lg:pb-0">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 md:gap-6 group">
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                                    <img 
                                        src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`) : 'https://via.placeholder.com/100'} 
                                        alt={item.name} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <span className="hidden md:block text-[10px] font-bold text-teal-600 uppercase tracking-widest">{item.category_name}</span>
                                    <Link to={`/product/${item.slug}`}>
                                        <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 truncate hover:text-teal-600 transition-colors">{item.name}</h3>
                                    </Link>
                                    <p className="text-teal-600 font-black md:hidden text-base">${item.price}</p>
                                    
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-0.5">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-teal-600 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-teal-600 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="hidden md:block w-24 text-right">
                                    <p className="font-bold text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="font-bold text-gray-900">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-teal-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-lg hover:shadow-teal-900/20 mb-4"
                            >
                                Proceed to Checkout
                            </button>
                            
                            <Link to="/products" className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-teal-600 transition-colors">
                                <ArrowLeft size={14} /> Continue Shopping
                            </Link>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-3 text-gray-400">
                                <ShieldCheck size={24} className="text-teal-500" />
                                <p className="text-[10px] font-medium leading-tight uppercase tracking-wider">
                                    Secure checkout with SSL Encryption and Buyer Protection
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Sticky Summary */}
            <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 z-[50] flex items-center justify-between gap-4 animate-fade-in-up">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                    <p className="text-xl font-black text-teal-600">${total.toFixed(2)}</p>
                </div>
                <button 
                    onClick={() => navigate('/checkout')}
                    className="flex-1 bg-gray-900 text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-gray-900/20"
                >
                    Checkout <ShoppingCart size={16} />
                </button>
            </div>
        </div>
    );
};

export default Cart;
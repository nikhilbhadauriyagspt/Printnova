import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import MobileSearchOverlay from './MobileSearchOverlay';

const MobileNav = () => {
    const location = useLocation();
    const { cartItems } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-[60] flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[32px]">
                <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-teal-600' : 'text-gray-400'}`}>
                    <Home size={22} className={isActive('/') ? 'fill-current' : ''} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                </Link>
                
                <Link to="/products" className={`flex flex-col items-center gap-1 ${isActive('/products') ? 'text-teal-600' : 'text-gray-400'}`}>
                    <ShoppingBag size={22} className={isActive('/products') ? 'fill-current' : ''} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Shop</span>
                </Link>

                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className={`flex flex-col items-center gap-1 ${isSearchOpen ? 'text-teal-600' : 'text-gray-400'}`}
                >
                    <Search size={22} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Search</span>
                </button>

                <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${isActive('/cart') ? 'text-teal-600' : 'text-gray-400'}`}>
                    <div className="relative">
                        <ShoppingBag size={22} className={isActive('/cart') ? 'fill-current' : ''} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Cart</span>
                </Link>

                <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') || isActive('/login') ? 'text-teal-600' : 'text-gray-400'}`}>
                    <User size={22} className={isActive('/profile') ? 'fill-current' : ''} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
                </Link>
            </div>

            <MobileSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default MobileNav;

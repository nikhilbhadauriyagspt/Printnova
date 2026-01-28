import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Heart, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                    <Heart size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">Save your favorite items here to find them easily later.</p>
                <Link to="/products" className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all">
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative aspect-square bg-gray-50 p-8 flex items-center justify-center">
                                <img 
                                    src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`) : 'https://via.placeholder.com/400'} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" 
                                />
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full text-red-500 shadow-sm border border-gray-100 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="p-5">
                                <Link to={`/product/${item.slug}`}>
                                    <h3 className="font-bold text-gray-800 mb-4 truncate hover:text-teal-600 transition-colors">{item.name}</h3>
                                </Link>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-teal-600">${item.price}</span>
                                    <button 
                                        onClick={() => {
                                            addToCart(item);
                                            removeFromWishlist(item.id);
                                        }}
                                        className="bg-gray-900 text-white p-2 rounded-lg hover:bg-teal-600 transition-colors"
                                        title="Move to Cart"
                                    >
                                        <ShoppingBag size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
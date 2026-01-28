import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
            <div className="relative mb-8">
                <h1 className="text-[12rem] md:text-[18rem] font-black text-gray-50 opacity-[0.03] select-none">404</h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6 animate-bounce">
                        <Search size={48} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Oops! Page not found.</h2>
                </div>
            </div>
            
            <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium text-lg leading-relaxed">
                The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                >
                    <Home size={20} /> Back to Home
                </Link>
                <Link 
                    to="/products" 
                    className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:border-teal-600 hover:text-teal-600 transition-all active:scale-95"
                >
                    <ArrowLeft size={20} /> Go to Shop
                </Link>
            </div>
        </div>
    );
};

export default NotFound;

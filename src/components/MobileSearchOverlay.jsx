import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileSearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in flex flex-col">
            <div className="p-4 flex items-center gap-4 border-b border-gray-100">
                <button onClick={onClose} className="p-2 text-gray-400">
                    <X size={24} />
                </button>
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Search for printers, ink..." 
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-3 text-teal-600">
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
            
            <div className="flex-1 p-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                    {['HP LaserJet', 'Epson Ink', 'Canon Pixma', '3D Printer', 'Brother'].map(term => (
                        <button 
                            key={term}
                            onClick={() => { setQuery(term); navigate(`/products?search=${term}`); onClose(); }}
                            className="px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-all"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileSearchOverlay;

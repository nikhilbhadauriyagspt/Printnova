import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Package } from 'lucide-react';
import api from '../api/api';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length > 1) {
                try {
                    const res = await api.get(`/products?search=${query}`);
                    setSuggestions(res.data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Search error");
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(false);
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="relative w-full group">
            <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
                />
                {query && (
                    <button 
                        type="button"
                        onClick={() => { setQuery(''); setSuggestions([]); }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)}></div>
                    <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {suggestions.map((item) => (
                                <Link 
                                    key={item.id} 
                                    to={`/product/${item.id}`}
                                    onClick={() => { setShowSuggestions(false); setQuery(''); }}
                                    className="flex items-center gap-3 p-3 hover:bg-teal-50 rounded-xl transition-all group"
                                >
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`} className="max-h-full object-contain" alt="" />
                                        ) : <Package className="text-gray-300 w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{item.category_name}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black text-gray-900">${item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                            <button 
                                onClick={handleSearch}
                                className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-teal-600 transition-all"
                            >
                                Found {suggestions.length} results — View All
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchBar;
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Filter, ChevronDown, Grid, List, Search, Star, Heart, Eye, ShoppingBag, X } from 'lucide-react';

const Shop = () => {
    const location = useLocation();
    
    const [view, setView] = useState('grid');
    const [priceRange, setPriceRange] = useState(100000);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorySEO, setCategorySEO] = useState(null);
    
    // Filters State
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(new URLSearchParams(location.search).get('category') || 'All');
    const [sortBy, setSortBy] = useState('newest');
    const [stockStatus, setStockStatus] = useState('');

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        if (selectedCategory !== 'All') {
            const cat = categories.find(c => c.slug === selectedCategory);
            if (cat) setCategorySEO(cat);
        } else {
            setCategorySEO(null);
        }
    }, [selectedCategory, categories]);

    // Fetch Products with Filters
    useEffect(() => {
        let isMounted = true;
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (selectedCategory !== 'All') params.append('category', selectedCategory);
                if (searchTerm) params.append('search', searchTerm);
                if (priceRange < 100000) params.append('maxPrice', priceRange);
                if (sortBy) params.append('sort', sortBy);
                if (stockStatus) params.append('stock', stockStatus);
                
                const res = await api.get(`/products?${params.toString()}`);
                if (isMounted) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchProducts();
        
        return () => {
            isMounted = false;
        };
    }, [selectedCategory, searchTerm, priceRange, sortBy, stockStatus]);

    // Initial Category Fetch
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catRes = await api.get('/categories');
                setCategories(catRes.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    // Sync Search with URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearchTerm(queryParams.get('search') || '');
        setSelectedCategory(queryParams.get('category') || 'All');
    }, [location.search]);

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange(100000);
        setSortBy('newest');
        setStockStatus('');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {categorySEO ? (
                <Helmet>
                    <title>{categorySEO.meta_title || `${categorySEO.name} | My Project`}</title>
                    <meta name="description" content={categorySEO.meta_description || `Shop our best collection of ${categorySEO.name}.`} />
                    <meta name="keywords" content={categorySEO.meta_keywords || ''} />
                </Helmet>
            ) : (
                <SEO 
                    pageName="shop" 
                    fallbackTitle="Shop Printers & Supplies" 
                    fallbackDesc="Browse our wide selection of printers and accessories." 
                />
            )}
            {/* Header Strip */}
            <div className="bg-white border-b border-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        {selectedCategory !== 'All' ? selectedCategory : 'Shop All Products'}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Link to="/" className="hover:text-teal-600 font-medium">Home</Link> 
                        <ChevronDown size={14} className="-rotate-90 text-gray-300" /> 
                        <span className="text-gray-900 font-bold">Shop</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* --- SIDEBAR FILTERS --- */}
                    <div className="w-full lg:w-1/4 space-y-8">
                        
                        {/* Search Bar in Sidebar */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-4">Search</h3>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="w-full p-3 pr-10 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Sorting */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-4">Sort By</h3>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Best Rating</option>
                            </select>
                        </div>

                        {/* Stock Status */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-4">Availability</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="stock" checked={stockStatus === ''} onChange={() => setStockStatus('')} className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm text-gray-600">All Items</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="stock" checked={stockStatus === 'in-stock'} onChange={() => setStockStatus('in-stock')} className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm text-gray-600">In Stock Only</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="radio" name="stock" checked={stockStatus === 'out-of-stock'} onChange={() => setStockStatus('out-of-stock')} className="w-4 h-4 text-teal-600" />
                                    <span className="text-sm text-gray-600">Out of Stock</span>
                                </label>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Categories</h3>
                            <div className="space-y-1">
                                <CategoryItem 
                                    name="All Categories" 
                                    active={selectedCategory === 'All'} 
                                    onClick={() => setSelectedCategory('All')} 
                                />
                                {categories.map((cat) => (
                                    <CategoryItem 
                                        key={cat.id}
                                        name={cat.name} 
                                        active={selectedCategory === cat.slug} 
                                        onClick={() => setSelectedCategory(cat.slug)} 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest mb-6">Max Price</h3>
                            <input 
                                type="range" 
                                min="0" 
                                max="100000" 
                                step="100"
                                value={priceRange} 
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-teal-600 mb-4"
                            />
                            <div className="flex justify-between text-sm font-black text-gray-900">
                                <span className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">$0</span>
                                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-lg border border-teal-100">${priceRange}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- PRODUCT GRID --- */}
                    <div className="flex-1">
                        
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500 font-medium">Found <span className="font-black text-gray-900">{products.length}</span> items</p>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex gap-2 border-gray-200">
                                    <button onClick={() => setView('grid')} className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}>
                                        <Grid size={18} />
                                    </button>
                                    <button onClick={() => setView('list')} className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}>
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        {loading ? (
                            <div className={`grid ${view === 'grid' ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-8`}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                    <div key={i} className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 p-4 md:p-6 space-y-4">
                                        <Skeleton className="aspect-square w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <div className="flex justify-between pt-4">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className={`grid ${view === 'grid' ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-8`}>
                                {products.map((product) => (
                                    <ShopProductCard key={product.id} product={product} view={view} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                                <button onClick={clearAllFilters} className="mt-8 text-teal-600 font-bold hover:underline uppercase tracking-widest text-xs">Clear all filters</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const FilterChip = ({ text, onClear }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-teal-100">
        {text}
        <button onClick={onClear} className="hover:text-teal-900"><X size={12} /></button>
    </span>
);

const CategoryItem = ({ name, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex justify-between items-center group ${
            active ? 'bg-teal-600 text-white font-bold shadow-lg shadow-teal-900/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
        {name}
        <ChevronDown size={14} className={`-rotate-90 transition-transform ${active ? 'text-white' : 'text-gray-300 group-hover:translate-x-1'}`} />
    </button>
);

const ShopProductCard = React.memo(({ product, view }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const activeWishlist = isInWishlist(product.id);

    const isOutOfStock = product.stock <= 0;
    const badge = isOutOfStock ? 'Sold Out' : (product.is_featured ? 'Featured' : (parseFloat(product.mrp) > parseFloat(product.price) ? 'Sale' : ''));

    const imageUrl = product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `/products/${product.image_url}`) : 'https://via.placeholder.com/400';

    return (
        <div className={`bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 overflow-hidden group hover:border-teal-200 transition-all duration-500 relative ${view === 'list' ? 'flex flex-row' : 'flex-col h-full'}`}>
            {/* Image */}
            <div className={`relative bg-gray-50 p-4 md:p-8 flex items-center justify-center overflow-hidden ${view === 'list' ? 'w-1/3' : 'aspect-square'}`}>
                <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=No+Image'}
                />
                {badge && (
                    <div className="absolute top-3 left-3 md:top-5 md:left-5">
                        <span className={`text-white text-[7px] md:text-[9px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-widest ${isOutOfStock ? 'bg-gray-900' : 'bg-teal-500 shadow-lg shadow-teal-500/30'}`}>
                            {badge}
                        </span>
                    </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-3 right-3 md:top-5 md:right-5 flex flex-col gap-2 opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <button 
                        onClick={() => toggleWishlist(product)}
                        className={`p-1.5 md:p-2.5 rounded-full border border-gray-100 shadow-sm transition-colors ${activeWishlist ? 'bg-red-500 border-red-500 text-white' : 'bg-white hover:bg-teal-500 hover:text-white'}`}
                    >
                        <Heart className={`w-3 h-3 md:w-4 md:h-4 ${activeWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <Link to={`/product/${product.slug}`} className="bg-white p-1.5 md:p-2.5 rounded-full border border-gray-100 shadow-sm hover:bg-teal-500 hover:text-white transition-colors">
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 flex-1 flex flex-col justify-center">
                <span className="text-[8px] md:text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1 md:mb-2 block">{product.category_name || 'General'}</span>
                <Link to={`/product/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1 md:mb-2 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors" title={product.name}>{product.name}</h3>
                </Link>
                
                {view === 'list' && (
                    <p className="hidden md:block text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">{product.description || ''}</p>
                )}

                <div className="flex items-center gap-1 text-amber-400 text-[10px] md:text-xs font-black mb-3 md:mb-6">
                    <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 fill-current" /> {product.rating || 4.5} 
                    <span className="text-gray-300 ml-1 hidden md:inline">({product.review_count || 120})</span>
                </div>

                <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 pt-3 md:pt-4 border-t border-gray-50">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg md:text-2xl font-black text-gray-900">${product.price}</span>
                        {parseFloat(product.mrp) > parseFloat(product.price) && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through font-bold">${product.mrp}</span>
                        )}
                    </div>
                    <button 
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product)}
                        className={`w-full md:w-auto px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-teal-600 shadow-lg hover:shadow-teal-900/20 active:scale-95'}`}
                    >
                        {isOutOfStock ? 'Sold' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Shop;

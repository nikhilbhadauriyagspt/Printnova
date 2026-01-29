import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';
import { ArrowRight, Star, Heart, Eye, Truck, ShieldCheck, Clock, UserCheck, Mail, ChevronLeft, ChevronRight, Timer, Zap, Quote, Calendar, X, ShoppingBag, Check } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState('New Arrivals');
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [deal, setDeal] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: '00', mins: '00', secs: '00' });
    const [loadingPrimary, setLoadingPrimary] = useState(true);
    const { addToCart } = useCart();
    const scrollRef = useRef(null);

    // Primary Data Fetch (Critical for Initial Render)
    useEffect(() => {
        const fetchPrimaryData = async () => {
            try {
                const results = await Promise.allSettled([
                    api.get('/products'),
                    api.get('/categories')
                ]);

                if (results[0].status === 'fulfilled') setProducts(results[0].value.data);
                if (results[1].status === 'fulfilled') setCategories(results[1].value.data);
            } catch (error) {
                console.error("Error fetching primary data:", error);
            } finally {
                setLoadingPrimary(false);
            }
        };
        fetchPrimaryData();
    }, []);

    // Secondary Data Fetch (Defer to unblock main thread)
    useEffect(() => {
        const fetchSecondaryData = async () => {
            try {
                // Small delay to allow initial render to complete
                await new Promise(resolve => setTimeout(resolve, 100));
                
                const results = await Promise.allSettled([
                    api.get('/settings/deal'),
                    api.get('/blogs')
                ]);

                if (results[0].status === 'fulfilled') setDeal(results[0].value.data);
                if (results[1].status === 'fulfilled') setBlogs(results[1].value.data);
            } catch (error) {
                console.error("Error fetching secondary data:", error);
            }
        };
        fetchSecondaryData();
    }, []);

    // Countdown Timer Logic
    useEffect(() => {
        if (!deal?.deal_expiry) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(deal.deal_expiry).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ hours: '00', mins: '00', secs: '00' });
                return;
            }

            const hours = Math.floor((distance / (1000 * 60 * 60)));
            const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                hours: hours.toString().padStart(2, '0'),
                mins: mins.toString().padStart(2, '0'),
                secs: secs.toString().padStart(2, '0')
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [deal]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Filter products for tabs
    const getTabProducts = () => {
        if (!products.length) return [];
        if (activeTab === 'New Arrivals') {
            return [...products].sort((a, b) => b.id - a.id).slice(0, 8);
        } else if (activeTab === 'Best Sellers') {
            return products.filter(p => p.is_best_selling).slice(0, 8);
        } else if (activeTab === 'On Sale') {
            return products.filter(p => parseFloat(p.mrp) > parseFloat(p.price)).slice(0, 8);
        }
        return products.slice(0, 8);
    };

    const tabProducts = getTabProducts();

    return (
        <div className="bg-gray-50 min-h-screen relative">
            <SEO
                pageName="home"
                fallbackTitle="Home - Best Printer Store"
                fallbackDesc="Shop high-quality printers, ink, and 3D printing supplies."
            />
            <Hero />

            {/* QUICK VIEW MODAL */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            )}

            {/* --- SECTION 1: TRUSTED BRANDS --- */}
            <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
                <div className="container mx-auto px-4 text-center mb-6">
                    <p className="text-gray-400 font-semibold uppercase tracking-widest text-[10px]">Trusted by 500+ Companies</p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {['HP', 'Canon', 'Epson', 'Brother', 'Xerox', 'Samsung', 'Ricoh'].map((brand) => (
                        <span key={brand} className="text-2xl md:text-3xl font-black text-gray-400 hover:text-teal-600 cursor-default tracking-tighter">{brand}</span>
                    ))}
                </div>
            </section>

            {/* --- SECTION 2: SHOP BY CATEGORY --- */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-teal-600 font-bold tracking-wider uppercase text-xs">Collections</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">Shop by Category</h2>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-teal-600 transition-colors">
                        View All Collections <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 gap-y-20">
                    {loadingPrimary ? Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                             <Skeleton className="w-32 h-32 rounded-full" />
                             <Skeleton className="h-4 w-24" />
                        </div>
                    )) : categories.slice(0, 10).map((cat, idx) => (
                        <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group flex flex-col items-center gap-4 cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden group-hover:border-teal-400 group-hover:shadow-lg transition-all duration-300 relative">
                                <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                                {cat.image ? (
                                    <img
                                        src={cat.image.startsWith('http') ? cat.image : `/category/${cat.image}`}
                                        alt={`${cat.name} category - PrintNova`}
                                        loading="lazy"
                                        className="w-full object-cover z-10 group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=' + cat.name.charAt(0)}
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-gray-300 group-hover:text-teal-600 transition-colors z-10">{cat.name.charAt(0)}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors text-center text-sm px-2">{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* --- SECTION 3: CURATED PICKS (Tabs) --- */}
            <section className="container mx-auto px-4 mb-24">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <h2 className="text-3xl font-bold text-gray-900">Curated Picks</h2>

                    <div className="flex bg-white p-1 rounded-full border border-gray-200 shadow-sm">
                        {['New Arrivals', 'Best Sellers', 'On Sale'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {loadingPrimary ? Array(4).fill(0).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-square w-full rounded-2xl" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    )) : tabProducts.length > 0 ? tabProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={() => setQuickViewProduct(product)}
                        />
                    )) : (
                        <div className="col-span-4 text-center py-20 text-gray-400">No products found.</div>
                    )}
                </div>
            </section>

            {/* --- SECTION 4: PROMO BANNER --- */}
            <section className="container mx-auto px-4 mb-24">
                <div className="bg-gray-900 rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
                    <img
                        src="/home/middle-bg.jpg"
                        alt="Promo"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="relative z-10 px-8 md:px-20 max-w-2xl">
                        <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Limited Offer</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-6 mb-6 leading-tight">
                            Upgrade Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Home Office Today.</span>
                        </h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Get up to <span className="text-white font-bold">30% OFF</span> on our premium wireless series.
                        </p>
                        <button className="bg-white text-gray-900 hover:bg-teal-500 hover:text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1">
                            Explore Deals
                        </button>
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: FLASH SALE (Slider) --- */}
            <section className="container mx-auto px-4 mb-24">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Flash Sale</h2>
                            <p className="text-sm text-gray-500">Deals ending soon</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-colors bg-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-colors bg-white"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loadingPrimary ? Array(4).fill(0).map((_, i) => (
                        <div key={i} className="min-w-[280px] md:min-w-[300px] snap-start">
                             <Skeleton className="aspect-square w-full rounded-2xl mb-4" />
                             <Skeleton className="h-4 w-3/4" />
                        </div>
                    )) : products.slice(0, 10).map((product) => (
                        <div key={product.id} className="min-w-[280px] md:min-w-[300px] snap-start">
                            <ProductCard
                                product={product}
                                onQuickView={() => setQuickViewProduct(product)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION 6: TESTIMONIALS --- */}
            <section className="bg-teal-900 py-24 mb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-teal-300 font-bold tracking-wider uppercase text-xs">Testimonials</span>
                        <h2 className="text-3xl font-bold text-white mt-2">What Our Clients Say</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sarah Johnson"
                            role="Creative Director"
                            text="The print quality of the Canon Pixma is absolutely stunning. It has completely transformed our studio's workflow."
                            img="https://placehold.co/100x100?text=S"
                        />
                        <TestimonialCard
                            name="Michael Chen"
                            role="Small Business Owner"
                            text="Incredible service! We ordered 10 units for our office, and they arrived the next day. The bulk discount was a lifesaver."
                            img="https://placehold.co/100x100?text=M"
                        />
                        <TestimonialCard
                            name="Emma Davis"
                            role="Freelance Photographer"
                            text="I was skeptical about buying ink online, but their genuine cartridges are the real deal. Will definitely order again."
                            img="https://placehold.co/100x100?text=E"
                        />
                    </div>
                </div>
            </section>

            {/* --- SECTION 7: DEAL OF THE DAY --- */}
            {deal && (
                <section className="container mx-auto px-4 mb-24">
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="p-10 md:p-16 flex-1 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                                <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs mb-4">
                                    <Timer className="w-4 h-4" /> Deal of the Day
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">{deal.name}</h2>
                                <p className="text-gray-500 mb-8 leading-relaxed line-clamp-3">
                                    {deal.description}
                                </p>
                                <div className="flex gap-4 mb-10">
                                    <TimeBox val={timeLeft.hours} label="Hours" />
                                    <TimeBox val={timeLeft.mins} label="Mins" />
                                    <TimeBox val={timeLeft.secs} label="Secs" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-bold text-teal-600">${deal.price}</span>
                                    {parseFloat(deal.mrp) > parseFloat(deal.price) && (
                                        <span className="text-xl text-gray-400 line-through">${deal.mrp}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => addToCart(deal)}
                                    className="mt-8 bg-gray-900 text-white w-fit px-8 py-3 rounded-full font-bold hover:bg-teal-600 transition-colors"
                                >
                                    Grab this Deal
                                </button>
                            </div>
                            <div className="flex-1 bg-teal-50 relative min-h-[400px]">
                                <img
                                    src={deal.image_url ? (deal.image_url.startsWith('http') ? deal.image_url : `/products/${deal.image_url}`) : 'https://via.placeholder.com/800'}
                                    alt={deal.name}
                                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply p-10 hover:scale-105 transition-transform duration-700"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/800?text=Special+Deal'}
                                />
                                {parseFloat(deal.mrp) > parseFloat(deal.price) && (
                                    <div className="absolute top-6 right-6 bg-red-500 text-white font-bold px-4 py-2 rounded-lg rotate-12">
                                        -{Math.round(((deal.mrp - deal.price) / deal.mrp) * 100)}%
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* --- SECTION 8: TECH INSIGHTS --- */}
            <section className="container mx-auto px-4 mb-24">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-teal-600 font-bold tracking-wider uppercase text-xs">Resources</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-1">Tech Insights</h2>
                    </div>
                    <Link to="/products" className="text-gray-500 font-semibold hover:text-teal-600">View All Articles &rarr;</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.slice(0, 3).map((blog) => (
                        <BlogCard
                            key={blog.id}
                            image={blog.image_url || "https://via.placeholder.com/600x400?text=Tech+Insight"}
                            date={new Date(blog.created_at).toLocaleDateString()}
                            title={blog.title}
                            desc={blog.description}
                            slug={blog.slug}
                        />
                    ))}
                    {blogs.length === 0 && <p className="col-span-3 text-center text-gray-400 py-10">No articles available.</p>}
                </div>
            </section>

            {/* --- SECTION 9: WHY CHOOSE US --- */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-teal-600 font-bold tracking-wider uppercase text-xs">Our Promise</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">We deliver more than just printers.</h2>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                From small home offices to large corporate setups, we provide end-to-end printing solutions.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FeatureItem icon={<Truck className="w-6 h-6 text-teal-600" />} title="Fast Delivery" desc="Same day dispatch on orders before 2 PM." />
                                <FeatureItem icon={<ShieldCheck className="w-6 h-6 text-teal-600" />} title="Secure Warranty" desc="Comprehensive coverage for peace of mind." />
                                <FeatureItem icon={<Clock className="w-6 h-6 text-teal-600" />} title="24/7 Support" desc="Expert technicians ready to help anytime." />
                                <FeatureItem icon={<UserCheck className="w-6 h-6 text-teal-600" />} title="Certified Genuine" desc="100% authentic products directly from brands." />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-teal-100/50 rounded-full blur-3xl opacity-50"></div>
                            <img src="/why-choose-us.jpg" alt="Services" className="relative z-10 rounded-2xl border border-gray-100" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 10: NEWSLETTER --- */}
            <section className="container mx-auto px-4 py-20">
                <div className="bg-teal-900 rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-300">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay in the Loop</h2>
                        <p className="text-teal-100 mb-8 text-lg">Subscribe to get <span className="text-white font-bold">10% OFF</span> your first purchase.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-teal-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 backdrop-blur-sm" />
                            <button className="px-8 py-4 rounded-full bg-white text-teal-900 font-bold hover:bg-teal-50 transition-all">Subscribe</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// --- Helper Components ---

const QuickViewModal = ({ product, onClose }) => {
    const { addToCart } = useCart();
    if (!product) return null;
    const imageUrl = product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `/products/${product.image_url}`) : 'https://via.placeholder.com/400';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-scale-up">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                </button>

                {/* Left: Image */}
                <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center">
                    <img src={imageUrl} alt={product.name} className="w-full max-w-sm object-contain mix-blend-multiply" onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=No+Image'} />
                </div>

                {/* Right: Details */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <span className="text-teal-600 font-bold text-xs uppercase tracking-wider mb-2">{product.category_name || 'Category'}</span>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-amber-400"><Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /> <Star className="w-4 h-4 fill-current" /></div>
                        <span className="text-sm text-gray-500">({product.review_count || 0} Reviews)</span>
                    </div>

                    <p className="text-gray-500 mb-8 leading-relaxed max-h-32 overflow-y-auto text-sm">{product.description || "Product description unavailable."}</p>

                    <div className="flex items-center gap-6 mb-8">
                        <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                        <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            <Check className="w-4 h-4" /> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => { addToCart(product); onClose(); }}
                            disabled={product.stock <= 0}
                            className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200 disabled:bg-gray-200"
                        >
                            <ShoppingBag className="w-5 h-5" /> Add to Cart
                        </button>
                        <button className="px-4 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500">
                            <Heart className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCard = memo(({ product, onQuickView }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const activeWishlist = isInWishlist(product.id);
    const imageUrl = product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `/products/${product.image_url}`) : 'https://via.placeholder.com/400';

    return (
        <div className="bg-white rounded-[24px] md:rounded-2xl border border-gray-100 overflow-hidden group hover:border-teal-200 transition-all duration-300 relative h-full flex flex-col">
            <div className="relative aspect-square bg-gray-50 p-4 md:p-8 flex items-center justify-center overflow-hidden">
                <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400?text=No+Image'}
                    />
                </Link>

                {/* Floating Actions */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-col gap-2 opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`p-1.5 md:p-2 rounded-full border border-gray-100 transition-colors ${activeWishlist ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white hover:bg-teal-500 hover:text-white'}`}
                    >
                        <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={onQuickView}
                        className="hidden md:flex bg-white p-2 rounded-full border border-gray-100 hover:bg-teal-500 hover:text-white transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                </div>

                {parseFloat(product.mrp) > parseFloat(product.price) && (
                    <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-orange-500 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded">SALE</span>
                )}
            </div>

            <div className="p-3 md:p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1 md:mb-2">
                    <span className="text-[8px] md:text-xs font-semibold text-gray-400 uppercase tracking-wide">{product.category_name || 'Category'}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-[10px] md:text-xs font-bold">
                        <Star className="w-2.5 h-2.5 md:w-3 h-3 fill-current" /> {product.rating || 0}
                    </div>
                </div>

                <Link to={`/product/${product.slug}`}>
                    <h3 className="font-bold text-gray-800 text-xs md:text-lg mb-1 md:mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors" title={product.name}>{product.name}</h3>
                </Link>

                <div className="mt-auto flex flex-col md:flex-row md:items-center justify-between pt-3 md:pt-4 border-t border-gray-50 gap-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-base md:text-xl font-bold text-gray-900">${product.price}</span>
                        {parseFloat(product.mrp) > parseFloat(product.price) && (
                            <span className="text-[10px] md:text-xs text-gray-400 ml-1 line-through">${product.mrp}</span>
                        )}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-gray-100 text-gray-900 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[10px] md:text-sm font-bold hover:bg-teal-600 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:bg-gray-50 disabled:text-gray-300"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" /> {product.stock > 0 ? 'Add' : 'Sold'}
                    </button>
                </div>
            </div>
        </div>
    );
});

const TestimonialCard = memo(({ name, role, text, img }) => (
    <div className="bg-teal-800/50 backdrop-blur-sm p-8 rounded-2xl border border-teal-700/50">
        <Quote className="w-8 h-8 text-teal-400 mb-6 opacity-50" />
        <p className="text-teal-50 text-lg mb-6 leading-relaxed italic">"{text}"</p>
        <div className="flex items-center gap-4">
            <img src={img} alt={name} className="w-12 h-12 rounded-full border-2 border-teal-600" />
            <div>
                <h4 className="text-white font-bold">{name}</h4>
                <p className="text-teal-400 text-xs uppercase tracking-wide">{role}</p>
            </div>
        </div>
    </div>
));

const BlogCard = memo(({ image, date, title, desc, slug }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:border-teal-200 transition-colors">
        <div className="h-48 overflow-hidden relative">
            <Link to={`/blog/${slug}`}>
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </Link>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-bold text-gray-800 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {date}
            </div>
        </div>
        <div className="p-6">
            <Link to={`/blog/${slug}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{title}</h3>
            </Link>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{desc}</p>
            <Link to={`/blog/${slug}`} className="text-teal-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    </div>
));

const TimeBox = ({ val, label }) => (
    <div className="flex flex-col items-center">
        <div className="bg-gray-900 text-white w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-xl md:text-2xl font-bold border border-gray-800">
            {val}
        </div>
        <span className="text-xs font-medium text-gray-500 mt-2 uppercase tracking-wide">{label}</span>
    </div>
);

const FeatureItem = memo(({ icon, title, desc }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="bg-white p-3 rounded-lg shadow-sm text-teal-600 border border-gray-100">{icon}</div>
        <div>
            <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
            <p className="text-sm text-gray-500 leading-snug">{desc}</p>
        </div>
    </div>
));

export default Home;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import toast from 'react-hot-toast';
import { 
    Star, 
    ShoppingCart, 
    Heart, 
    ShieldCheck, 
    Truck, 
    RotateCcw, 
    Minus, 
    Plus, 
    ChevronRight,
    Check,
    MessageCircle,
    User,
    Zap
} from 'lucide-react';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToCart } = useCart();
    const { wishlist, toggleWishlist } = useWishlist();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const isInWishlist = wishlist && Array.isArray(wishlist) ? wishlist.some(item => item.slug === slug) : false;

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const productRes = await api.get(`/products/slug/${slug}`);
                const currentProduct = productRes.data;
                setProduct(currentProduct);

                // Fetch Reviews and Related Products using the ID from the slug-fetched product
                const [reviewsRes, relRes] = await Promise.all([
                    api.get(`/reviews/product/${currentProduct.id}`),
                    api.get('/products', { 
                        params: { category: currentProduct.category_id } 
                    })
                ]);
                
                setReviews(reviewsRes.data);
                setRelatedProducts(relRes.data.filter(p => p.id !== currentProduct.id).slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch product data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [slug]);

    const handleBuyNow = () => {
        addToCart(product, quantity);
        navigate('/checkout');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmittingReview(true);
            await api.post('/reviews', { 
                product_id: id, 
                rating: newReview.rating, 
                comment: newReview.comment 
            });
            const res = await api.get(`/reviews/product/${id}`);
            setReviews(res.data);
            setNewReview({ rating: 5, comment: '' });
            toast.success('Review submitted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center italic text-gray-400">Loading product...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Product not found.</div>;

    const imageUrl = product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `/products/${product.image_url}`) : 'https://via.placeholder.com/600';

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO 
                pageName={`prod_${product.id}`}
                fallbackTitle={`${product.name} | Buy Online at PrintNova`}
                fallbackDesc={product.description?.substring(0, 160)}
                image={imageUrl}
                type="product"
            />
            <SchemaMarkup type="product" data={product} />

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4 border-b border-gray-100 mb-10">
                <div className="container mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/products" className="hover:text-teal-600 transition-colors">Shop</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 truncate font-bold">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* --- LEFT: IMAGES --- */}
                    <div className="flex-1 space-y-6">
                        <div className="aspect-square bg-gray-50 rounded-[40px] border border-gray-100 flex items-center justify-center p-12 overflow-hidden group shadow-sm">
                            <img 
                                src={imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                                onError={(e) => e.target.src = 'https://via.placeholder.com/600?text=No+Image'}
                            />
                        </div>
                    </div>

                    {/* --- RIGHT: CONTENT --- */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-teal-100">{product.category_name}</span>
                            {product.stock > 0 ? (
                                <span className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-widest"><Check size={12} /> In Stock</span>
                            ) : (
                                <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
                            )}
                        </div>

                        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={18} className={`${s <= (Math.round(product.rating) || 0) ? 'fill-current' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-400 tracking-tight">({product.review_count || 0} Customer Reviews)</span>
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <span className="text-4xl font-black text-teal-600">${product.price}</span>
                            {parseFloat(product.mrp) > parseFloat(product.price) && (
                                <>
                                    <span className="text-xl text-gray-300 line-through font-bold">${product.mrp}</span>
                                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">SAVE {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-500 leading-relaxed mb-10 font-medium">{product.description}</p>

                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-1 shadow-inner">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:text-teal-600 transition-colors"><Minus size={20} /></button>
                                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center hover:text-teal-600 transition-colors"><Plus size={20} /></button>
                                </div>
                                <button 
                                    onClick={() => addToCart(product, quantity)}
                                    disabled={product.stock <= 0}
                                    className="flex-1 min-w-[160px] bg-gray-100 text-gray-900 h-14 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-teal-50 transition-all border border-gray-200 disabled:opacity-50"
                                >
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    disabled={product.stock <= 0}
                                    className="flex-1 min-w-[160px] bg-gray-900 text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-teal-600 transition-all shadow-xl disabled:bg-gray-200 active:scale-95"
                                >
                                    <Zap size={20} /> Buy Now
                                </button>
                                <button 
                                    onClick={() => toggleWishlist(product)}
                                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${isInWishlist ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-200' : 'border-gray-200 hover:bg-red-50 hover:text-red-500'}`}
                                >
                                    <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-gray-100">
                                <TrustBadge icon={<Truck size={20} />} title="Fast Shipping" desc="2-3 Days Delivery" />
                                <TrustBadge icon={<ShieldCheck size={20} />} title="Official Warranty" desc="12 Months Support" />
                                <TrustBadge icon={<RotateCcw size={20} />} title="Easy Returns" desc="30 Days Policy" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="flex border-b border-gray-100 mb-10">
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`px-8 py-4 font-bold text-sm uppercase tracking-widest border-b-2 transition-all ${activeTab === 'description' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400'}`}
                        >
                            Description
                        </button>
                        <button 
                            onClick={() => setActiveTab('reviews')}
                            className={`px-8 py-4 font-bold text-sm uppercase tracking-widest border-b-2 transition-all ${activeTab === 'reviews' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400'}`}
                        >
                            Reviews ({reviews.length})
                        </button>
                    </div>

                    {activeTab === 'description' ? (
                        <div className="prose max-w-none text-gray-500 leading-loose font-medium">
                            {product.description}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {user ? (
                                <div className="bg-gray-50 rounded-[40px] p-8 lg:p-12 border border-gray-100 shadow-sm">
                                    <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Add a Review</h3>
                                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                                        <div className="flex gap-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star} 
                                                    type="button"
                                                    onClick={() => setNewReview({...newReview, rating: star})}
                                                    className={`transition-all hover:scale-110 active:scale-90 ${star <= newReview.rating ? 'text-amber-400' : 'text-gray-200'}`}
                                                >
                                                    <Star size={36} className={star <= newReview.rating ? 'fill-current' : ''} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea 
                                            required
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                            placeholder="Write your review here..."
                                            className="w-full bg-white border border-gray-200 rounded-3xl p-6 min-h-[150px] focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all shadow-sm"
                                        ></textarea>
                                        <button 
                                            type="submit"
                                            disabled={submittingReview}
                                            className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 active:scale-95"
                                        >
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-[40px] p-10 text-center border border-dashed border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Want to share your feedback?</h3>
                                    <p className="text-gray-500 mb-6 font-medium text-sm">Please log in to your account to leave a review for this product.</p>
                                    <Link to="/login" className="inline-flex bg-teal-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/10 active:scale-95">Log In Now</Link>
                                </div>
                            )}

                            <div className="space-y-8">
                                {reviews.length > 0 ? reviews.map((review) => (
                                    <div key={review.id} className="flex gap-6 pb-8 border-b border-gray-100 last:border-0 group animate-fade-in">
                                        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 flex-shrink-0 font-black text-xl shadow-sm group-hover:rotate-3 transition-transform">
                                            {review.user_name?.charAt(0).toUpperCase() || <User size={30} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                                                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex text-amber-400 mb-3">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={14} className={s <= review.rating ? 'fill-current' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                            <p className="text-gray-500 leading-relaxed font-medium">{review.comment}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-[40px] border border-gray-100">
                                        <MessageCircle size={40} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 font-bold text-sm italic">No reviews yet. Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-32 pb-20 md:pb-0">
                        <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">You might also like</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                            {relatedProducts.map((p) => (
                                <Link key={p.id} to={`/product/${p.slug}`} className="group">
                                    <div className="bg-gray-50 rounded-[24px] md:rounded-[40px] aspect-square p-4 md:p-8 mb-4 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-teal-200 group-hover:shadow-xl transition-all duration-500">
                                        <img 
                                            src={p.image_url ? (p.image_url.startsWith('http') ? p.image_url : `/products/${p.image_url}`) : 'https://via.placeholder.com/200'} 
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                                            alt={p.name} 
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate tracking-tight text-sm md:text-base">{p.name}</h3>
                                    <p className="text-teal-600 font-black text-base md:text-lg">${p.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 z-[50] flex items-center gap-4 animate-fade-in-up">
                <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</p>
                    <p className="text-xl font-black text-teal-600">${product.price}</p>
                </div>
                <button 
                    onClick={() => addToCart(product, quantity)}
                    disabled={product.stock <= 0}
                    className="flex-[2] bg-gray-900 text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-gray-900/20"
                >
                    <ShoppingCart size={16} /> {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};

const TrustBadge = ({ icon, title, desc }) => (
    <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-teal-600 border border-gray-100 shadow-inner">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">{title}</p>
            <p className="text-[10px] text-gray-400 font-bold leading-none">{desc}</p>
        </div>
    </div>
);

export default ProductDetails;
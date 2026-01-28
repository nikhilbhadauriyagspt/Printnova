import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import api from '../api/api';
import {
    ShoppingCart,
    User,
    Heart,
    Menu,
    X,
    ChevronDown,
    LogOut,
    LayoutDashboard,
    Package,
    Zap,
    Tag,
    UserPlus,
    LogIn,
    Settings,
    Printer
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [branding, setBranding] = useState({ name: 'MyStore', logo_url: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
        const fetchData = async () => {
            // Fetch separately to avoid one failing the other
            api.get('/categories')
                .then(res => setCategories(res.data))
                .catch(err => console.error("Failed to fetch categories", err));

            api.get(`/websites/${websiteId}`)
                .then(res => setBranding(res.data))
                .catch(err => console.error("Failed to fetch branding", err));
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    // Helper to split categories into columns for mega menu
    const chunkArray = (arr, size) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    };

    const categoryColumns = chunkArray(categories, Math.ceil(categories.length / 3)).slice(0, 3);

    return (
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50 font-sans">
            {/* --- Main Header Row --- */}
            <div className="container mx-auto px-4 py-3 md:py-4">
                <div className="flex items-center justify-between gap-8">
                    
                    {/* 1. Logo */}
                    <Link to="/" className="flex-shrink-0 group">
                        <div className="flex items-center gap-1">
                            {branding.logo_url ? (
                                <img src={branding.logo_url} alt={branding.name} className="h-8 md:h-10 w-auto object-contain" />
                            ) : (
                                <>
                                    <div className="w-8 h-8 md:w-9 md:h-9 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl group-hover:bg-teal-700 transition-all">
                                        {branding.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <h1 className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 group-hover:text-teal-900 transition-colors">
                                        {branding.name}<span className="text-teal-500">.</span>
                                    </h1>
                                </>
                            )}
                        </div>
                    </Link>

                    {/* 2. Search Bar */}
                    <div className="hidden md:flex flex-1 justify-center max-w-2xl">
                        <SearchBar />
                    </div>

                                        {/* 3. Actions Icons */}

                                        <div className="flex items-center gap-2 md:gap-5">

                                            

                                            {/* Wishlist - Hidden on Mobile, available in Bottom Nav or Profile */}

                                            <Link to="/wishlist" className="hidden md:flex p-2 text-gray-500 hover:text-teal-600 transition-colors relative">

                                                 <Heart className="w-6 h-6" />

                                                 {wishlistItems.length > 0 && (

                                                    <span className="absolute top-0 right-0 bg-teal-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{wishlistItems.length}</span>

                                                 )}

                                            </Link>

                    

                                            {/* Cart - Hidden on Mobile Top, available in Bottom Nav */}

                                            <Link to="/cart" className="hidden md:flex p-2 text-gray-500 hover:text-teal-600 transition-colors relative">

                                                <ShoppingCart className="w-6 h-6" />

                                                {cartItems.length > 0 && (

                                                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">

                                                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}

                                                    </span>

                                                )}

                                            </Link>

                    

                                            {/* --- USER PROFILE DROPDOWN - Hidden on Mobile Top --- */}

                                            <div className="hidden md:block relative">

                    
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-1 p-1 rounded-full border border-gray-100 hover:border-teal-200 transition-all bg-gray-50/50"
                            >
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 border border-gray-100">
                                    {user && user.name ? (
                                        <span className="text-sm font-bold text-teal-600">{user.name.charAt(0).toUpperCase()}</span>
                                    ) : (
                                        <User className="w-5 h-5" />
                                    )}
                                </div>
                                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-100 py-3 z-50 animate-fade-in-up">

                                        {user ? (
                                            /* --- LOGGED IN VIEW --- */
                                            <>
                                                <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account</p>
                                                    <p className="font-bold text-gray-800 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    <DropdownLink to="/profile" icon={<User size={16} />} text="My Profile" />
                                                    <DropdownLink to="/orders" icon={<Package size={16} />} text="My Orders" />
                                                    <DropdownLink to="/settings" icon={<Settings size={16} />} text="Settings" />
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-gray-50 px-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                                    >
                                                        <LogOut className="w-4 h-4" /> Sign Out
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            /* --- NOT LOGGED IN VIEW --- */
                                            <div className="px-4 py-2">
                                                <div className="text-center mb-4">
                                                    <p className="font-bold text-gray-800 text-lg">Welcome!</p>
                                                    <p className="text-xs text-gray-500">Access your account & orders</p>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <Link
                                                        to="/login"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-sm"
                                                    >
                                                        <LogIn className="w-4 h-4" /> Login
                                                    </Link>
                                                    <Link
                                                        to="/register"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="w-full bg-white text-gray-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-gray-200 hover:border-teal-600 hover:text-teal-600 transition-all"
                                                    >
                                                        <UserPlus className="w-4 h-4" /> Create Account
                                                    </Link>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <Link to="/faq" className="hover:text-teal-600">Help</Link>
                                                    <Link to="/track" className="hover:text-teal-600">Track Order</Link>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:text-teal-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                    </div>
                </div>
            </div>

            {/* --- Navigation Bar (Mega Menu) - Hidden on Mobile --- */}
            <div className="hidden md:block border-t border-gray-100 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-14">

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-teal-600"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink to="/" text="Home" />

                            {/* Mega Menu Trigger */}
                            <div className="group static">
                                <Link to="/products" className="flex items-center gap-1 px-4 py-4 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600 relative">
                                    Shop Categories <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
                                </Link>

                                {/* Full Width Mega Menu */}
                                <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 border-b shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top z-40">
                                    <div className="container mx-auto px-4 py-8">
                                        <div className="grid grid-cols-4 gap-8">
                                            {/* Column 1 */}
                                            <div>
                                                <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                                                    <Printer className="w-4 h-4 text-orange-500" /> Printers
                                                </h3>
                                                <ul className="space-y-2.5 text-sm text-gray-500">
                                                    {categoryColumns[0]?.map(cat => (
                                                        <MegaLink key={cat.id} to={`/products?category=${cat.slug}`} text={cat.name} />
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* Column 2 */}
                                            <div>
                                                <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                                                    <Zap className="w-4 h-4 text-teal-500" /> Technology
                                                </h3>
                                                <ul className="space-y-2.5 text-sm text-gray-500">
                                                    {categoryColumns[1]?.map(cat => (
                                                        <MegaLink key={cat.id} to={`/products?category=${cat.slug}`} text={cat.name} />
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* Column 3 */}
                                            <div>
                                                <h3 className="font-bold text-teal-900 mb-4 flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-pink-500" /> Accessories
                                                </h3>
                                                <ul className="space-y-2.5 text-sm text-gray-500">
                                                    {categoryColumns[2]?.map(cat => (
                                                        <MegaLink key={cat.id} to={`/products?category=${cat.slug}`} text={cat.name} />
                                                    ))}
                                                </ul>
                                            </div>
                                            {/* Column 4: Promo Image */}
                                            <Link to="/products" className="bg-gray-100 rounded-xl p-6 relative overflow-hidden group/card cursor-pointer border border-gray-200 block">
                                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent"></div>
                                                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">Sale</span>
                                                <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover/card:text-teal-700 transition-colors">New Arrivals</h4>
                                                <p className="text-gray-500 text-sm mb-4">Check out our latest printers.</p>
                                                <span className="text-teal-600 text-xs font-bold uppercase tracking-wider underline">Shop Now</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <NavLink to="/products?filter=new" text="New Arrivals" badge="NEW" badgeColor="bg-teal-500" />
                            <NavLink to="/products?filter=deals" text="Deals" badge="HOT" badgeColor="bg-red-500" />
                            <NavLink to="/faq" text="FAQ" />
                            <NavLink to="/about" text="About" />
                            <NavLink to="/contact" text="Contact" />
                        </div>

                        {/* Right: Quick Call to Action */}
                        <div className="flex items-center gap-4">
                            <Link to="/faq" className="text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors cursor-pointer">
                                Need Help?
                            </Link>
                            <a
                                href={`mailto:${branding.contact_email}`}
                                className="bg-gray-900 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-teal-600 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                                GET IN TOUCH
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 absolute w-full left-0 z-50 animate-fade-in h-screen overflow-y-auto pb-20">
                    <div className="flex flex-col gap-4 font-bold text-gray-700">
                        <Link to="/" className="py-2 border-b border-gray-50">Home</Link>
                        <div className="py-2 border-b border-gray-50">
                            <span className="block mb-2 text-teal-600">Categories</span>
                            <div className="pl-4 flex flex-col gap-2 font-normal text-sm">
                                {categories.map(cat => (
                                    <Link key={cat.id} to={`/products?category=${cat.slug}`} onClick={() => setIsMenuOpen(false)}>{cat.name}</Link>
                                ))}
                            </div>
                        </div>
                        <Link to="/products?filter=new" className="py-2 border-b border-gray-50">New Arrivals</Link>
                        <Link to="/contact" className="py-2">Contact Us</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const DropdownLink = ({ to, icon, text }) => (
    <Link to={to} className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-all group">
        <span className="text-gray-400 group-hover:text-teal-600">{icon}</span>
        {text}
    </Link>
);

const NavLink = ({ to, text, badge, badgeColor }) => (
    <Link to={to} className="px-4 py-4 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors border-b-2 border-transparent hover:border-teal-600 relative flex items-center gap-2 h-full">
        {text}
        {badge && (
            <span className={`${badgeColor} text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold leading-none`}>
                {badge}
            </span>
        )}
    </Link>
);

const MegaLink = ({ to, text }) => (
    <li className="cursor-pointer hover:text-teal-600 hover:translate-x-1 transition-all duration-200 flex items-center gap-2">
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <Link to={to} className="block w-full">{text}</Link>
    </li>
);

export default Navbar;
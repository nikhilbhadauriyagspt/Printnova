import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, AlertTriangle, Package, Zap, Layout } from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

const AdminDashboard = () => {
    const { selectedWebsiteId } = useAdmin();
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        lowStock: 0,
        salesAnalytics: [],
        topProducts: [],
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [dealForm, setDealForm] = useState({
        deal_product_id: '',
        deal_expiry: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, prodRes, settingsRes] = await Promise.all([
                    api.get('/admin/stats', { params: { website_id: selectedWebsiteId } }),
                    api.get('/products'),
                    api.get('/settings')
                ]);
                setStats(statsRes.data);
                setProducts(prodRes.data);
                setDealForm({
                    deal_product_id: settingsRes.data.deal_product_id || '',
                    deal_expiry: settingsRes.data.deal_expiry ? settingsRes.data.deal_expiry.split('T')[0] : ''
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedWebsiteId]);

    const handleDealUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/settings', dealForm);
            alert('Deal of the day updated!');
        } catch (error) {
            alert('Update failed');
        }
    };

    const chartData = stats.salesAnalytics.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        amount: parseFloat(item.amount)
    }));

    return (
        <div>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Real-time performance metrics for your storefronts.</p>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    title="Total Revenue" 
                    val={`$${Number(stats.revenue).toLocaleString()}`} 
                    icon={<DollarSign size={22} className="text-teal-600" />} 
                    bg="bg-teal-50"
                />
                <StatCard 
                    title="Total Orders" 
                    val={stats.orders} 
                    icon={<ShoppingBag size={22} className="text-blue-600" />} 
                    bg="bg-blue-50"
                />
                <StatCard 
                    title="Customers" 
                    val={stats.customers} 
                    icon={<Users size={22} className="text-purple-600" />} 
                    bg="bg-purple-50"
                />
                <StatCard 
                    title="Low Stock" 
                    val={stats.lowStock} 
                    icon={<AlertTriangle size={22} className="text-red-600" />} 
                    bg="bg-red-50"
                    trend={stats.lowStock > 0 ? "Alert" : "Safe"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Sales Analytics</h3>
                            <p className="text-xs text-gray-400 font-medium">Daily revenue for the last 7 days</p>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold', color: '#0d9488' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-teal-600" /> Top Selling
                    </h3>
                    {/* ... existing top products logic ... */}
                    <div className="space-y-6">
                        {stats.topProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-xs font-black text-teal-600 border border-gray-100">{i+1}</div>
                                    <span className="text-sm font-medium text-gray-700 truncate w-32" title={p.name}>{p.name}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">{p.total_sold} sold</span>
                            </div>
                        ))}
                        {stats.topProducts.length === 0 && <p className="text-gray-400 text-sm italic py-10 text-center">No sales data yet.</p>}
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="mt-10 pt-8 border-t border-gray-50">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Layout size={20} className="text-blue-500" /> Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickActionBtn to="/admin/products" label="Add Product" color="bg-blue-50 text-blue-600" />
                            <QuickActionBtn to="/admin/coupons" label="New Coupon" color="bg-purple-50 text-purple-600" />
                            <QuickActionBtn to="/admin/orders" label="View Orders" color="bg-orange-50 text-orange-600" />
                            <QuickActionBtn to="/admin/seo" label="Manage SEO" color="bg-teal-50 text-teal-600" />
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-gray-50">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-orange-500" /> Deal of Day
                        </h3>
                        {/* ... rest of the deal form ... */}
                        <form onSubmit={handleDealUpdate} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Select Product</label>
                                <select 
                                    className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                                    value={dealForm.deal_product_id}
                                    onChange={e => setDealForm({...dealForm, deal_product_id: e.target.value})}
                                >
                                    <option value="">Choose product...</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Expiry Date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-2 bg-gray-50 border border-gray-100 rounded-lg text-xs"
                                    value={dealForm.deal_expiry}
                                    onChange={e => setDealForm({...dealForm, deal_expiry: e.target.value})}
                                />
                            </div>
                            <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-teal-600 transition-colors">
                                Save Deal
                            </button>
                        </form>
                    </div>
                </div>

            </div>

            {/* --- RECENT ORDERS TABLE --- */}
            <div className="mt-8 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
                        <p className="text-xs text-gray-400 font-medium">The latest transactions across your stores</p>
                    </div>
                    <Link to="/admin/orders" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                        View All Orders <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 uppercase font-black text-[10px] tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Order ID</th>
                                <th className="px-8 py-4">Customer</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Amount</th>
                                <th className="px-8 py-4 text-right">Website</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold italic">Refreshing list...</td></tr>
                            ) : stats.recentOrders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-5 font-bold text-gray-900">#ORD-{o.id}</td>
                                    <td className="px-8 py-5 text-gray-600 font-medium">{o.user_name}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-900">${Number(o.total_amount).toFixed(2)}</td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md border border-teal-100">
                                            {o.website_name || 'Main Store'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, val, trend, icon, bg }) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group active:scale-95 cursor-default">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${bg} group-hover:scale-110 transition-transform`}>{icon}</div>
            {trend && <span className={`text-[10px] font-black ${trend === 'Alert' ? 'text-red-600 bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100'} px-2.5 py-1 rounded-lg border`}>{trend}</span>}
        </div>
        <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{val}</h3>
        </div>
    </div>
);

const QuickActionBtn = ({ to, label, color }) => (
    <Link to={to} className={`p-4 rounded-2xl ${color} font-bold text-[10px] uppercase tracking-widest text-center hover:shadow-md transition-all active:scale-95`}>
        {label}
    </Link>
);

export default AdminDashboard;

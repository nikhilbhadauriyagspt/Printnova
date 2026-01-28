import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Package, 
  Bell, 
  Search,
  ChevronDown,
  Globe,
  MessageSquare,
  Tag,
  Ticket,
  FileText,
  HelpCircle,
  Palette
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { websites, selectedWebsiteId, setSelectedWebsiteId } = useAdmin();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
      logout();
      navigate('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Tag, label: 'Categories', path: '/admin/categories' },
    { icon: Ticket, label: 'Coupons', path: '/admin/coupons' },
    { icon: Users, label: 'Customers', path: '/admin/users' },
    { icon: FileText, label: 'Policies', path: '/admin/policies' },
    { icon: HelpCircle, label: 'FAQs', path: '/admin/faqs' },
    { icon: Palette, label: 'Branding', path: '/admin/branding' },
    { icon: Globe, label: 'Websites', path: '/admin/websites' },
    { icon: Search, label: 'SEO', path: '/admin/seo' },
    { icon: MessageSquare, label: 'Queries', path: '/admin/queries' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: FileText, label: 'Articles', path: '/admin/blogs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-900 text-gray-400 fixed h-full flex flex-col border-r border-gray-800 z-20">
        
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
           <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
             M
           </div>
           <span className="text-white font-bold tracking-tight text-lg">Admin<span className="text-teal-500">.</span></span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
           {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link 
                 key={item.path} 
                 to={item.path}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                   isActive 
                   ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' 
                   : 'hover:bg-gray-800 hover:text-white'
                 }`}
               >
                 <item.icon size={20} />
                 <span className="font-medium text-sm">{item.label}</span>
               </Link>
             )
           })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
           <button 
             onClick={handleLogout}
             className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-400"
           >
             <LogOut size={20} />
             <span className="font-medium text-sm">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
           
           {/* Website Selector */}
           <div className="flex items-center gap-3">
             <Globe className="text-gray-400 w-5 h-5" />
             <select 
               className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-48 p-2.5 outline-none"
               value={selectedWebsiteId}
               onChange={(e) => setSelectedWebsiteId(e.target.value)}
             >
               <option value="">All Websites</option>
               {websites.map(site => (
                 <option key={site.id} value={site.id}>{site.name}</option>
               ))}
             </select>
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-gray-400 hover:text-teal-600 transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                 <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                 </div>
                 <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border border-teal-200">
                    A
                 </div>
              </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
           {children}
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;

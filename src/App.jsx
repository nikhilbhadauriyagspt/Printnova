import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute'; // Import Protection
import ScrollToTop from './components/ScrollToTop';
import MobileNav from './components/MobileNav';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminOrders from './pages/AdminOrders';
import AdminWebsites from './pages/AdminWebsites';
import AdminQueries from './pages/AdminQueries';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminSettings from './pages/AdminSettings';
import AdminUsers from './pages/AdminUsers';
import AdminPolicies from './pages/AdminPolicies';
import AdminFaqs from './pages/AdminFaqs';
import AdminBranding from './pages/AdminBranding';
import AdminCoupons from './pages/AdminCoupons';
import AdminSEO from './pages/AdminSEO';
import AdminBlogs from './pages/AdminBlogs';
import ProductDetails from './pages/ProductDetails';
import BlogDetails from './pages/BlogDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Troubleshooting from './pages/Troubleshooting';
import TrackOrder from './pages/TrackOrder';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';
import UserProfile from './pages/UserProfile';
import AboutUs from './pages/AboutUs';
import PolicyPage from './pages/PolicyPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
        {/* --- Admin Routes (Protected) --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminProtectedRoute>
        } />
        
        <Route path="/admin/orders" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/products" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/categories" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/websites" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminWebsites />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/branding" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminBranding />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/queries" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminQueries />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/settings" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/coupons" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminCoupons />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/seo" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminSEO />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/blogs" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminBlogs />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/policies" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminPolicies />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        <Route path="/admin/faqs" element={
          <AdminProtectedRoute>
            <AdminLayout>
              <AdminFaqs />
            </AdminLayout>
          </AdminProtectedRoute>
        } />

        {/* --- Public Routes --- */}
        <Route path="/*" element={
          <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
            <TopBar />
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/products" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetails />} />
                <Route path="/blog/:slug" element={<BlogDetails />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/troubleshooting" element={<Troubleshooting />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<UserProfile />} />
                <Route path="/pages/:type" element={<PolicyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
            <MobileNav />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
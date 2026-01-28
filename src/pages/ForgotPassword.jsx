import React, { useState } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">No worries, we'll send you reset instructions.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email-address" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            className="appearance-none relative block w-full px-4 py-4 bg-gray-50 border border-gray-100 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all sm:text-sm font-medium"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-gray-900 hover:bg-teal-600 focus:outline-none transition-all shadow-xl hover:shadow-teal-900/20 disabled:bg-gray-200"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                        </button>
                    </div>
                </form>
                <div className="mt-8 text-center">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-teal-600 transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

import React, { useState, useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AdminAuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // New Endpoint for Admin Table
            const { data } = await api.post('/admin/login', { username, password });
            
            // Login with admin data
            login(data.admin, data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid admin credentials');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full">
                
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-gray-400 mt-2 text-sm">Secure access for store management</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Admin Username</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-gray-600"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Secure Password</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute right-4 top-3.5 w-5 h-5 text-gray-600" />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-900/50 flex items-center justify-center gap-2 mt-4"
                        >
                            Access Dashboard <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <a href="/" className="text-gray-500 hover:text-white text-sm transition-colors">Return to Store</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

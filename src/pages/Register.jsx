import React, { useState, useContext } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row-reverse border border-gray-100 h-[650px]">
                
                {/* Right Side: Brand/Image (Reversed for Register) */}
                <div className="hidden md:flex flex-1 bg-gray-900 relative items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black z-0"></div>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 text-white text-center">
                        <h2 className="text-4xl font-bold mb-6">Join the Community</h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Create an account to unlock exclusive deals, fast checkout, and personalized recommendations.
                        </p>
                        <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
                    </div>
                </div>

                {/* Left Side: Form */}
                <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white relative">
                    <div className="absolute top-8 left-8">
                        <p className="text-sm text-gray-500">Already a member? <Link to="/login" className="text-teal-600 font-bold hover:underline">Log In</Link></p>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2 mt-8 md:mt-0">Create Account</h2>
                    <p className="text-gray-500 mb-8">Start your journey with us today.</p>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <User className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                            Sign Up <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">Or sign up with</span></div>
                        </div>
                        <div className="mt-6 flex gap-4 justify-center">
                            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><Chrome className="w-5 h-5 text-gray-600" /></button>
                            <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"><Github className="w-5 h-5 text-gray-600" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
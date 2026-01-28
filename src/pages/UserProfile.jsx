import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Calendar, Shield, LogOut, Settings, Bell, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to view your profile.</p>
          <Link to="/login" className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-teal-700 transition-all">Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left: User Card */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="bg-teal-600 h-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="px-8 pb-8 text-center -mt-12 relative z-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-teal-600 text-4xl font-black shadow-xl border-4 border-white mx-auto mb-4">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                        <p className="text-gray-400 text-sm font-medium mb-6">{user.email}</p>
                        
                        <div className="space-y-2">
                            <Link to="/orders" className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-teal-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-3">
                                    <Shield size={18} className="text-teal-600" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-teal-700">My Orders</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-all" />
                            </Link>
                            <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Account Settings */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage your preferences</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingField label="Full Name" value={user.name} icon={<User size={16}/>} />
                                <SettingField label="Email Address" value={user.email} icon={<Mail size={16}/>} />
                                <SettingField label="Password" value="••••••••••••" icon={<Lock size={16}/>} />
                                <SettingField label="Joined Date" value="Jan 20, 2026" icon={<Calendar size={16}/>} />
                            </div>
                        </section>

                        <section className="pt-8 border-t border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">Notifications</h3>
                            <div className="space-y-4">
                                <ToggleSetting label="Email Notifications" desc="Receive order updates and promotions via email." checked={true} />
                                <ToggleSetting label="Security Alerts" desc="Get notified about unusual login attempts." checked={true} />
                            </div>
                        </section>
                    </div>

                    <div className="mt-12 flex justify-end">
                        <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-xl hover:shadow-teal-900/20">
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const SettingField = ({ label, value, icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-800 text-sm">
            <span className="text-teal-500">{icon}</span>
            {value}
        </div>
    </div>
);

const ToggleSetting = ({ label, desc, checked }) => (
    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
        <div>
            <p className="font-bold text-gray-900">{label}</p>
            <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-teal-500' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'right-1' : 'left-1'}`}></div>
        </div>
    </div>
);

export default UserProfile;
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useTheme } from '../context/ThemeContext';
import { Settings, CreditCard, ShieldCheck, Save, Loader2, Info, Palette, Type, Zap } from 'lucide-react';

const AdminSettings = () => {
    const { fetchTheme } = useTheme();
    const [settings, setSettings] = useState({
        paypal_enabled: '0',
        paypal_mode: 'sandbox',
        paypal_sandbox_client_id: '',
        paypal_sandbox_secret: '',
        paypal_live_client_id: '',
        paypal_live_secret: '',
        cod_enabled: '1',
        primary_color: '#0d9488',
        primary_font: 'font-sans'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(prev => ({ ...prev, ...res.data }));
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/settings', settings);
            await fetchTheme(); // Immediately apply changes
            alert('Settings saved successfully');
        } catch (error) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-gray-400 font-bold">Loading configurations...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure payment gateways and site-wide rules</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* PayPal Configuration */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">PayPal Checkout</h2>
                                <p className="text-xs text-gray-500">Manage global PayPal integration</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <select 
                                className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 transition-all outline-none ${
                                    settings.paypal_mode === 'live' ? 'border-green-500 text-green-600 bg-green-50' : 'border-orange-400 text-orange-600 bg-orange-50'
                                }`}
                                value={settings.paypal_mode}
                                onChange={e => setSettings({...settings, paypal_mode: e.target.value})}
                            >
                                <option value="sandbox">Sandbox Mode</option>
                                <option value="live">Live Mode</option>
                            </select>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={settings.paypal_enabled === '1'} 
                                    onChange={e => setSettings({...settings, paypal_enabled: e.target.checked ? '1' : '0'})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-10">
                        {/* Sandbox Credentials */}
                        <div className={`p-6 rounded-2xl border-2 transition-all ${settings.paypal_mode === 'sandbox' ? 'border-orange-200 bg-orange-50/20' : 'border-gray-50 opacity-50'}`}>
                            <h3 className="text-xs font-black uppercase tracking-widest text-orange-600 mb-6 flex items-center gap-2">
                                <ShieldCheck size={14} /> Sandbox Credentials (Testing)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Sandbox Client ID</label>
                                    <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl font-mono text-xs" value={settings.paypal_sandbox_client_id} onChange={e => setSettings({...settings, paypal_sandbox_client_id: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Sandbox Secret</label>
                                    <input type="password" placeholder="••••••••" className="w-full p-3 bg-white border border-gray-200 rounded-xl font-mono text-xs" value={settings.paypal_sandbox_secret} onChange={e => setSettings({...settings, paypal_sandbox_secret: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        {/* Live Credentials */}
                        <div className={`p-6 rounded-2xl border-2 transition-all ${settings.paypal_mode === 'live' ? 'border-green-200 bg-green-50/20' : 'border-gray-50 opacity-50'}`}>
                            <h3 className="text-xs font-black uppercase tracking-widest text-green-600 mb-6 flex items-center gap-2">
                                <Zap size={14} /> Live Credentials (Production)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Live Client ID</label>
                                    <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl font-mono text-xs" value={settings.paypal_live_client_id} onChange={e => setSettings({...settings, paypal_live_client_id: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1">Live Secret</label>
                                    <input type="password" placeholder="••••••••" className="w-full p-3 bg-white border border-gray-200 rounded-xl font-mono text-xs" value={settings.paypal_live_secret} onChange={e => setSettings({...settings, paypal_live_secret: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COD Configuration */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* ... existing COD header ... */}
                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">Cash on Delivery</h2>
                                <p className="text-xs text-gray-500">Safe manual payment on arrival</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.cod_enabled === '1'} 
                                onChange={e => setSettings({...settings, cod_enabled: e.target.checked ? '1' : '0'})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                    </div>
                </div>

                {/* Theme Customization */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <Palette size={20} />
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900">Theme Customization</h2>
                                <p className="text-xs text-gray-500">Personalize your brand identity</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Primary Brand Color</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="color" 
                                    className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-gray-50 overflow-hidden"
                                    value={settings.primary_color}
                                    onChange={e => setSettings({...settings, primary_color: e.target.value})}
                                />
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-mono text-sm uppercase"
                                        value={settings.primary_color}
                                        onChange={e => setSettings({...settings, primary_color: e.target.value})}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">HEX code for buttons, icons, and highlights</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 flex items-center gap-1">
                                <Type size={12} /> Font Family
                            </label>
                            <select 
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white transition-all text-sm font-bold outline-none"
                                value={settings.primary_font}
                                onChange={e => setSettings({...settings, primary_font: e.target.value})}
                            >
                                <option value="font-sans">Standard Sans (Modern)</option>
                                <option value="font-serif">Classic Serif (Elegant)</option>
                                <option value="font-mono">Monospace (Tech)</option>
                            </select>
                            <p className="text-[10px] text-gray-400 mt-2">Changes the global typography style</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        disabled={saving}
                        className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-teal-600 transition-all shadow-xl hover:shadow-teal-900/20 disabled:bg-gray-300"
                    >
                        {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save size={20} />}
                        Save Settings
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AdminSettings;

import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Plus, Trash2, Globe, Link as LinkIcon } from 'lucide-react';
import api from '../api/api';

const AdminWebsites = () => {
  const { websites, fetchWebsites } = useAdmin();
  const [formData, setFormData] = useState({ name: '', url: '', logo_url: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/websites', formData);
      await fetchWebsites();
      setFormData({ name: '', url: '', logo_url: '' });
    } catch (error) {
      alert('Error creating website');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/websites/${id}`);
      fetchWebsites();
    } catch (error) {
      alert('Error deleting website');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Websites</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your storefronts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Website Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
           <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
             <Plus className="w-5 h-5 text-teal-600" />
             Add New Website
           </h2>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
               <input 
                 type="text" 
                 placeholder="e.g. Fashion Store" 
                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                 value={formData.name}
                 onChange={e => setFormData({...formData, name: e.target.value})}
                 required
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
               <div className="relative">
                 <LinkIcon className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                 <input 
                   type="url" 
                   placeholder="https://example.com" 
                   className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                   value={formData.url}
                   onChange={e => setFormData({...formData, url: e.target.value})}
                   required
                 />
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (Optional)</label>
               <input 
                 type="url" 
                 placeholder="https://example.com/logo.png" 
                 className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                 value={formData.logo_url}
                 onChange={e => setFormData({...formData, logo_url: e.target.value})}
               />
             </div>
             <button 
               disabled={loading}
               className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               {loading ? 'Adding...' : 'Add Website'}
             </button>
           </form>
        </div>

        {/* Websites List */}
        <div className="lg:col-span-2 space-y-4">
          {websites.map((site) => (
            <div key={site.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <Globe className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800">{site.name}</h3>
                   <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline">{site.url}</a>
                 </div>
               </div>
               
               <button 
                 onClick={() => handleDelete(site.id)}
                 className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          ))}

          {websites.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
               <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
               <p className="text-gray-500">No websites added yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminWebsites;
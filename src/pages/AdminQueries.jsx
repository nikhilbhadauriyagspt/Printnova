import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Mail, Clock, Globe } from 'lucide-react';
import api from '../api/api';

const AdminQueries = () => {
  const { selectedWebsiteId } = useAdmin();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/contact`, {
          params: { website_id: selectedWebsiteId }
        });
        setQueries(res.data);
      } catch (error) {
        console.error("Error fetching queries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, [selectedWebsiteId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Queries</h1>
          <p className="text-gray-500 text-sm mt-1">
             {selectedWebsiteId ? 'Showing queries for selected website' : 'Showing all queries across all websites'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
           <div className="text-center py-10 text-gray-500">Loading queries...</div>
        ) : queries.length > 0 ? (
           queries.map((query) => (
             <div key={query.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 font-bold">
                        {query.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{query.subject || 'No Subject'}</h3>
                        <p className="text-sm text-gray-500">{query.name} &bull; {query.email} {query.phone && ` &bull; ${query.phone}`}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1 justify-end">
                         <Clock className="w-3.5 h-3.5" />
                         {new Date(query.created_at).toLocaleDateString()}
                      </div>
                      {query.website_name && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                           <Globe className="w-3 h-3" />
                           {query.website_name}
                        </div>
                      )}
                   </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed">
                   {query.message}
                </div>
             </div>
           ))
        ) : (
           <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No queries found.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminQueries;
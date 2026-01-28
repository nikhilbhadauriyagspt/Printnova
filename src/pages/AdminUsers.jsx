import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import api from '../api/api';
import { Users, Mail, Globe, Clock, Search } from 'lucide-react';

const AdminUsers = () => {
    const { selectedWebsiteId } = useAdmin();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/users', {
                    params: { website_id: selectedWebsiteId }
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [selectedWebsiteId]);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {selectedWebsiteId ? 'Users registered via selected storefront' : 'Global user database'}
                    </p>
                </div>
                <div className="bg-teal-50 px-4 py-2 rounded-xl border border-teal-100 flex items-center gap-2">
                    <Users className="text-teal-600 w-5 h-5" />
                    <span className="text-teal-700 font-bold">{users.length} Total Users</span>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-5 border-b border-gray-100">User Details</th>
                                {!selectedWebsiteId && <th className="p-5 border-b border-gray-100">Website</th>}
                                <th className="p-5 border-b border-gray-100">Role</th>
                                <th className="p-5 border-b border-gray-100">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    {!selectedWebsiteId && (
                                        <td className="p-5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100">
                                                <Globe className="w-3 h-3" /> {u.website_name || 'Main Store'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="p-5">
                                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-gray-400">
                                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;

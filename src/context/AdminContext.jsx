import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const [websites, setWebsites] = useState([]);
    const [selectedWebsiteId, setSelectedWebsiteId] = useState(''); // '' means All
    const [loading, setLoading] = useState(false);

    const fetchWebsites = async () => {
        try {
            const res = await api.get('/websites');
            setWebsites(res.data);
        } catch (error) {
            console.error("Failed to fetch websites", error);
        }
    };

    useEffect(() => {
        fetchWebsites();
    }, []);

    const value = {
        websites,
        selectedWebsiteId,
        setSelectedWebsiteId,
        fetchWebsites
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

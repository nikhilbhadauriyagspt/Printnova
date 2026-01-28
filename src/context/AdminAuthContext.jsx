import { createContext, useState, useEffect, useContext } from 'react';

export const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('adminUser');
            if (savedUser && savedUser !== "undefined") {
                return JSON.parse(savedUser);
            }
        } catch (error) {
            console.error("Error parsing admin user from localStorage", error);
        }
        return null;
    });

    const login = (userData, token) => {
        localStorage.setItem('adminUser', JSON.stringify(userData));
        localStorage.setItem('adminToken', token);
        setAdminUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        setAdminUser(null);
    };

    const isAuthenticated = !!localStorage.getItem('adminToken');

    return (
        <AdminAuthContext.Provider value={{ adminUser, login, logout, isAuthenticated }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

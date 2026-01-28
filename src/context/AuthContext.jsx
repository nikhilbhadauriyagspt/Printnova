import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            // Check if savedUser is not null and not the string "undefined"
            if (savedUser && savedUser !== "undefined") {
                return JSON.parse(savedUser);
            }
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
        }
        return null;
    });

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
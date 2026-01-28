import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        primary_color: '#0d9488',
        primary_font: 'font-sans'
    });

    const fetchTheme = async () => {
        try {
            const res = await api.get('/settings');
            const newTheme = {
                primary_color: res.data.primary_color || '#0d9488',
                primary_font: res.data.primary_font || 'font-sans'
            };
            setTheme(newTheme);
            
            // Apply CSS Variables
            document.documentElement.style.setProperty('--primary-color', newTheme.primary_color);
            document.body.className = newTheme.primary_font;
        } catch (error) {
            console.error("Failed to load theme");
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, fetchTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

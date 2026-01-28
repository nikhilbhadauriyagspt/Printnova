import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(JSON.parse(localStorage.getItem('wishlist')) || []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (product) => {
        setWishlistItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (id) => {
        return wishlistItems.some(item => item.id === id);
    };

    const removeFromWishlist = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

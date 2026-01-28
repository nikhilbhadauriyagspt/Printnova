import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { AdminProvider } from './context/AdminContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ThemeProvider } from './context/ThemeContext'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GOOGLE_CLIENT_ID = "553830176554-u4s0ltsjrfospmt5cbfpleevnt1sbikc.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <AdminProvider>
                <CartProvider>
                  <WishlistProvider>
                    <App />
                  </WishlistProvider>
                </CartProvider>
              </AdminProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)

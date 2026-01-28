import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Request interceptor for token
api.interceptors.request.use((config) => {
    // Prioritize regular user token for customer-facing features
    // Only use admin token if user token is not present
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

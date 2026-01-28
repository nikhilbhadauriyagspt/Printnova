const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

/* ======================
   Middleware
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   Security Headers
====================== */
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
    );
    next();
});

// COOP for Google Auth
app.use((req, res, next) => {
    res.setHeader(
        'Cross-Origin-Opener-Policy',
        'same-origin-allow-popups'
    );
    next();
});

/* ======================
   Base Test Route
====================== */
app.get('/', (req, res) => {
    res.send('Ecommerce API is running...');
});

/* ======================
   API Reach Test
====================== */
app.get('/api/test', (req, res) => {
    res.json({ status: 'API reachable' });
});

/* ======================
   DB Test Route
====================== */
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS ok');
        res.json(rows);
    } catch (err) {
        console.error('DB test error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ======================
   Routes
====================== */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/websites', require('./routes/websiteRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/policies', require('./routes/policyRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/seo', require('./routes/seoRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

/* ======================
   DB Connection Check
   ❌ NO process.exit()
====================== */
db.query('SELECT 1')
    .then(() => {
        console.log('MySQL DB connected successfully!');
    })
    .catch((err) => {
        console.error('MySQL DB connection error:', err.message);
        // ❗ Do NOT exit process on Hostinger
    });

/* ======================
   Start Server
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

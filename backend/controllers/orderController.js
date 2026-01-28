const db = require('../config/db');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/emailService');

// Place Order (Supports Guest & Registered)
exports.placeOrder = async (req, res) => {
    const body = req.body;
    const items = body.items || [];
    
    let user_id = null;
    
    // 1. Determine User ID (Priority: Body is more specific for checkout)
    // But we MUST verify it exists to avoid FK error
    const target_id = body.user_id || req.user?.id;

    if (target_id) {
        try {
            const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [target_id]);
            if (userCheck.length > 0) {
                user_id = target_id;
            } else {
                console.log(`User ID ${target_id} not found in users table. Treating as Guest.`);
            }
        } catch (e) {
            console.error('User verification failed:', e.message);
        }
    }

    try {
        // 2. Insert Order
        const [result] = await db.query(
            `INSERT INTO orders 
            (user_id, website_id, guest_name, guest_email, guest_phone, total_amount, shipping_address, payment_method, payment_status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, 
                body.website_id || 1, 
                body.guest_name || null, 
                body.guest_email || null, 
                body.guest_phone || null, 
                body.total_amount, 
                body.shipping_address, 
                body.payment_method || 'COD', 
                body.payment_method === 'PayPal' ? 'completed' : 'pending'
            ]
        );
        
        const order_id = result.insertId;

        // 3. Insert Items
        for (let item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [order_id, item.product_id, item.quantity, item.price]
            );
            // Deduct Stock
            await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
        }

        // 4. Cleanup Cart
        if (user_id) {
            await db.query('DELETE FROM cart WHERE user_id = ?', [user_id]);
        }

        res.status(201).json({ message: 'Order placed successfully', order_id });
    } catch (err) {
        console.error('Final SQL Error:', err.message);
        res.status(500).json({ error: err.message });
    }
};

// ... keep other functions same ...
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, u.name as user_name, u.email as user_email, w.name as website_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            LEFT JOIN websites w ON o.website_id = w.id
            ORDER BY o.created_at DESC`);
        
        const mappedOrders = orders.map(o => ({
            ...o,
            display_name: o.user_id ? o.user_name : (o.guest_name ? `${o.guest_name} (Guest)` : 'Guest'),
            display_email: o.user_id ? o.user_email : o.guest_email
        }));
        res.json(mappedOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const [order] = await db.query(`
            SELECT o.*, u.name as reg_name, u.email as reg_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?`, [req.params.id]);

        if (order.length === 0) return res.status(404).json({ message: 'Order not found' });
        
        const mainOrder = order[0];
        mainOrder.customer_name = mainOrder.user_id ? mainOrder.reg_name : mainOrder.guest_name;
        mainOrder.customer_email = mainOrder.user_id ? mainOrder.reg_email : mainOrder.guest_email;

        const [items] = await db.query(`
            SELECT oi.*, p.name as product_name, p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?`, [req.params.id]);
            
        res.json({ ...mainOrder, items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [user_id]
        );
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.trackOrder = async (req, res) => {
    let { order_id, email } = req.body;
    if (typeof order_id === 'string') {
        const numericMatch = order_id.match(/\d+/);
        if (numericMatch) order_id = numericMatch[0];
    }

    try {
        const [order] = await db.query(`
            SELECT o.*, u.name as reg_name, u.email as reg_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.id = ? AND (o.guest_email = ? OR u.email = ?)`,
            [order_id, email, email]
        );

        if (order.length === 0) return res.status(404).json({ message: 'Order not found' });

        const mainOrder = order[0];
        const [items] = await db.query(`
            SELECT oi.*, p.name as product_name, p.image_url 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?`, [order_id]);

        res.json({ ...mainOrder, items });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api/orders';

async function testGuestOrder() {
    console.log('\nTesting Guest Order...');
    try {
        const response = await axios.post(API_URL, {
            total_amount: 100,
            shipping_address: '123 Test St',
            items: [{ product_id: 1, quantity: 1, price: 100 }], // Ensure product 1 exists or use valid ID
            guest_name: 'Test Guest',
            guest_email: 'guest@test.com',
            guest_phone: '1234567890'
        });
        console.log('Guest Order Success:', response.data);
    } catch (error) {
        console.error('Guest Order Failed:', error.response ? error.response.data : error.message);
    }
}

async function testInvalidUserOrder() {
    console.log('\nTesting Invalid User Order (ID: 99999)...');
    const token = jwt.sign({ id: 99999, email: 'fake@fake.com' }, process.env.JWT_SECRET);
    
    try {
        const response = await axios.post(API_URL, {
            total_amount: 100,
            shipping_address: '123 Test St',
            items: [{ product_id: 1, quantity: 1, price: 100 }],
            payment_method: 'COD'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Invalid User Order Success (Should be Guest or handled):', response.data);
    } catch (error) {
        console.error('Invalid User Order Failed:', error.response ? error.response.data : error.message);
    }
}

// We need to ensure we have a product to order. 
// Ideally we check DB first, but let's assume Product ID 1 exists (from previous setup).
// If not, the order might fail on item insertion, but we are testing the ORDER insertion (user_id FK).

(async () => {
    await testGuestOrder();
    await testInvalidUserOrder();
})();

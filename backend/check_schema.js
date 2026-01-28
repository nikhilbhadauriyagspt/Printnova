const db = require('./config/db');

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM orders LIKE "user_id"');
        console.log('user_id column info:', JSON.stringify(columns, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
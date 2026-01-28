require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkColumns() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [columns] = await connection.query(`SHOW COLUMNS FROM seo_content`);
        console.log(columns.map(c => c.Field));
        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

checkColumns();

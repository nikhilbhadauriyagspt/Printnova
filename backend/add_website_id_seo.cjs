require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("Adding website_id to seo_content...");
        
        // Check if column exists
        const [columns] = await connection.query("SHOW COLUMNS FROM seo_content LIKE 'website_id'");
        if (columns.length === 0) {
            await connection.query("ALTER TABLE seo_content ADD COLUMN website_id INT DEFAULT 1 AFTER id");
            console.log("Column website_id added.");
        } else {
            console.log("Column website_id already exists.");
        }

        await connection.end();
    } catch (err) {
        console.error(err);
    }
}

migrate();

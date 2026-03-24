import fs from 'fs';
import db from './config/db.js';

const queryAsync = (sql, values = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });

const runSqlFile = async (filePath, label) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    const withoutLineComments = sql
        .split('\n')
        .map((line) => line.replace(/--.*$/, ''))
        .join('\n');

    const statements = withoutLineComments.split(';').filter((stmt) => stmt.trim());

    if (!statements.length) {
        return;
    }

    for (const statement of statements) {
        try {
            await queryAsync(statement);
        } catch (err) {
            console.error(`${label} failed:`, err.message);
            throw err;
        }
    }

    console.log(`${label} completed`);
};

const ensureUsersColumns = async () => {
    const requiredColumns = [
        { name: 'role', definition: "ENUM('user', 'admin') NOT NULL DEFAULT 'user'" },
        { name: 'temporary_password_active', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
        { name: 'temporary_password_used', definition: 'TINYINT(1) NOT NULL DEFAULT 0' },
        { name: 'temporary_password_expires_at', definition: 'DATETIME NULL' },
    ];

    for (const column of requiredColumns) {
        const columnRows = await queryAsync('SHOW COLUMNS FROM users LIKE ?', [column.name]);
        if (!columnRows.length) {
            await queryAsync(`ALTER TABLE users ADD COLUMN ${column.name} ${column.definition}`);
        }
    }

    await queryAsync("UPDATE users SET role = 'user' WHERE role = 'customer'");
    await queryAsync("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user'");
};

const ensureProductsColumns = async () => {
    const requiredColumns = [
        { name: 'department', definition: "VARCHAR(50) NOT NULL DEFAULT 'clothing'" },
        { name: 'old_price', definition: 'DECIMAL(10,2) DEFAULT NULL' },
        { name: 'rating', definition: 'DECIMAL(3,2) NOT NULL DEFAULT 0' },
        { name: 'reviews_count', definition: 'INT NOT NULL DEFAULT 0' },
        { name: 'color', definition: 'VARCHAR(255) DEFAULT NULL' },
        { name: 'image_url', definition: 'TEXT' },
        { name: 'images_json', definition: 'JSON DEFAULT NULL' },
    ];

    for (const column of requiredColumns) {
        const columnRows = await queryAsync('SHOW COLUMNS FROM products LIKE ?', [column.name]);
        if (!columnRows.length) {
            await queryAsync(`ALTER TABLE products ADD COLUMN ${column.name} ${column.definition}`);
        }
    }

    await queryAsync("UPDATE products SET department = 'electronics' WHERE department = 'electronic'");
    await queryAsync("UPDATE products SET department = 'groceries' WHERE department = 'groceeries'");

    const categoryRows = await queryAsync("SHOW COLUMNS FROM products LIKE 'category'");
    if (categoryRows.length) {
        await queryAsync('ALTER TABLE products DROP COLUMN category');
    }

    await queryAsync("ALTER TABLE products MODIFY COLUMN department ENUM('electronics', 'groceries', 'clothing', 'home-kitchen') NOT NULL DEFAULT 'clothing'");
};

const ensureOrdersColumns = async () => {
    const requiredColumns = [
        { name: 'payment_method', definition: "ENUM('card', 'esewa', 'khalti', 'ime-pay', 'bank-transfer', 'cash-on-delivery') NOT NULL DEFAULT 'card'" },
        { name: 'payment_status', definition: "ENUM('pending', 'paid', 'failed') NOT NULL DEFAULT 'pending'" },
        { name: 'delivery_status', definition: "ENUM('processing', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'processing'" },
        { name: 'tracking_note', definition: 'VARCHAR(255) DEFAULT NULL' },
        { name: 'updated_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
    ];

    for (const column of requiredColumns) {
        const columnRows = await queryAsync('SHOW COLUMNS FROM orders LIKE ?', [column.name]);
        if (!columnRows.length) {
            await queryAsync(`ALTER TABLE orders ADD COLUMN ${column.name} ${column.definition}`);
        }
    }
};

runSqlFile('./config/init.sql', 'Database init')
    .then(() => ensureUsersColumns())
    .then(() => ensureProductsColumns())
    .then(() => ensureOrdersColumns())
    .then(() => runSqlFile('./config/seed_products.sql', 'Product seed'))
    .catch(() => {
        // Keep API alive even if DB init/seed has issues.
    });

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  
import authRoute from './routes/auth.js';
import productRoute from './routes/products.js';
import categoryRoute from './routes/categories.js';
import reviewRoute from './routes/reviews.js';
import orderRoute from './routes/orders.js';
import cartRoute from './routes/cart.js';
import usersRoute from './routes/users.js';

dotenv.config()

const app = express(); 
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/orders', orderRoute);
app.use('/api/cart', cartRoute);
app.use('/api/users', usersRoute);


//PORT connection on 5000
const port = process.env.PORT;
app.listen(port, () =>{
    console.log("Backend is running on port 5000");
    console.log("Visit the localhost:5000/ to see the server");
});
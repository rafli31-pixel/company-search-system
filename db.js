require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.log('Database connection failed');
        console.log(err);
    });

module.exports = pool;
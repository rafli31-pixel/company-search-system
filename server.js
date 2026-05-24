require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const companyRoutes = require('./routes/companyRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('API Running');
});

// TEST DB
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Database error',
            error: error.message
        });
    }
});

// CEK KOLOM TABLE
app.get('/columns/:table', async (req, res) => {
    try {
        const tableName = req.params.table;

        const result = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = $1
        `, [tableName]);

        res.json(result.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error mengambil kolom'
        });
    }
});

app.use('/', companyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
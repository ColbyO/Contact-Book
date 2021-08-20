const pg = require('pg');

// Connect to PostgreSQL Database
const pool = new pg.Pool({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    database: 'contact',
    post: 5432
})

module.exports = pool;
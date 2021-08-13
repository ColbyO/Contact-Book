const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    database: 'contact',
    post: 5432
})

module.exports = pool;
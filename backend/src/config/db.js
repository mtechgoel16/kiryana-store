const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kiryana_store_db',
  user: process.env.DB_USER || 'kiryana_admin',
  password: process.env.DB_PASSWORD || 'KiryanaSecure2025'
});
module.exports = { query: (text, params) => pool.query(text, params) };

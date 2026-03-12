// backend/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",       // your DB username
  host: "localhost",
  database: "artapp",     // your DB name
  password: "1234",       // your DB password
  port: 5432,
});

module.exports = pool;
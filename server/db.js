import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'abdo600222',
  database: process.env.DB_NAME || 'focuszone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const fetchJson = async (res, query, params = []) => {
  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Database Query Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

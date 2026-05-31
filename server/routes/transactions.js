import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT transaction_id, booking_id, session_id, customer_id, 
              transaction_date, transaction_description, transaction_category, 
              transaction_amount, transaction_method, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
       FROM transactions 
       ORDER BY transaction_date DESC, created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

export default router;

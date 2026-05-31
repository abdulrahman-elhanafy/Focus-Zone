import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT customer_id, customer_name, customer_email, customer_phone, customer_age, customer_gender, 
              customer_membership, DATE_FORMAT(customer_last_visit, '%Y-%m-%d') AS customer_last_visit, 
              CAST(customer_balance AS DECIMAL(10,2)) AS customer_balance
       FROM customers ORDER BY customer_name`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_age, customer_gender, customer_membership } = req.body;
    const customer_id = `C${Date.now()}`;
    
    await pool.query(
      `INSERT INTO customers (customer_id, customer_name, customer_email, customer_phone, customer_age, customer_gender, customer_membership, customer_last_visit, customer_balance) 
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 0)`,
      [customer_id, customer_name, customer_email, customer_phone, customer_age, customer_gender, customer_membership]
    );

    const [[customer]] = await pool.query(
      `SELECT customer_id, customer_name, customer_email, customer_phone, customer_age, customer_gender, 
              customer_membership, DATE_FORMAT(customer_last_visit, '%Y-%m-%d') AS customer_last_visit, 
              CAST(customer_balance AS DECIMAL(10,2)) AS customer_balance 
       FROM customers WHERE customer_id = ?`,
      [customer_id]
    );
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create customer' });
  }
});

// Get customer by id
router.get('/:id', async (req, res) => {
  try {
    const [[customer]] = await pool.query(
      `SELECT customer_id, customer_name, customer_email, customer_phone, customer_age, customer_gender, 
              customer_membership, DATE_FORMAT(customer_last_visit, '%Y-%m-%d') AS customer_last_visit, 
              CAST(customer_balance AS DECIMAL(10,2)) AS customer_balance 
       FROM customers WHERE customer_id = ?`,
      [req.params.id]
    );
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

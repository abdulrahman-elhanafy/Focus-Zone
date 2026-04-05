import express from 'express';
import { pool, fetchJson } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await fetchJson(res, "SELECT id, name, email, phone, age, gender, membership, DATE_FORMAT(last_visit, '%Y-%m-%d') AS lastVisit, CAST(balance AS DOUBLE) AS balance, history FROM customers ORDER BY name");
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, age, gender, membership } = req.body;
    const id = `c${Date.now()}`;
    
    await pool.query(
      'INSERT INTO customers (id, name, email, phone, age, gender, membership, last_visit, balance, history) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, phone, age, gender, membership, new Date().toISOString().split('T')[0], 0.0, JSON.stringify([])]
    );

    const [[customer]] = await pool.query(
      "SELECT id, name, email, phone, age, gender, membership, DATE_FORMAT(last_visit, '%Y-%m-%d') AS lastVisit, CAST(balance AS DOUBLE) AS balance, history FROM customers WHERE id = ?",
      [id]
    );
    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Assuming future needs for getting by id, update and delete
router.get('/:id', async (req, res) => {
  try {
    const [[customer]] = await pool.query(
      "SELECT id, name, email, phone, age, gender, membership, DATE_FORMAT(last_visit, '%Y-%m-%d') AS lastVisit, CAST(balance AS DOUBLE) AS balance, history FROM customers WHERE id = ?",
      [req.params.id]
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

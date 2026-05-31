import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT item_id, item_name, item_price, item_stock, item_category 
       FROM items ORDER BY item_name`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch items' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { item_name, item_price, item_stock, item_category } = req.body;
    const item_id = `I${Date.now()}`;

    await pool.query(
      `INSERT INTO items (item_id, item_name, item_price, item_stock, item_category)
       VALUES (?, ?, ?, ?, ?)`,
      [item_id, item_name, item_price, item_stock, item_category]
    );

    const [[item]] = await pool.query(
      `SELECT item_id, item_name, item_price, item_stock, item_category 
       FROM items WHERE item_id = ?`,
      [item_id]
    );
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { item_price, item_stock } = req.body;
    const { id } = req.params;

    await pool.query(
      `UPDATE items SET item_price = ?, item_stock = ? WHERE item_id = ?`,
      [item_price, item_stock, id]
    );

    const [[item]] = await pool.query(
      `SELECT item_id, item_name, item_price, item_stock, item_category 
       FROM items WHERE item_id = ?`,
      [id]
    );
    res.json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update item' });
  }
});

export default router;

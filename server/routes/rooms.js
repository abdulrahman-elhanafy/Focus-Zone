import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.room_id, r.room_name, r.room_type, r.room_capacity, r.room_status, 
              rp.price_per_hour, rp.price_per_day
       FROM rooms r
       LEFT JOIN room_prices rp ON rp.room_id = r.room_id
       ORDER BY r.room_name`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch rooms' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { room_name, room_type, room_capacity, price_per_hour, price_per_day, room_status = 'available' } = req.body;
    const room_id = `R${Date.now()}`;

    await pool.query(
      'INSERT INTO rooms (room_id, room_name, room_type, room_capacity, room_status) VALUES (?, ?, ?, ?, ?)',
      [room_id, room_name, room_type, room_capacity, room_status]
    );
    await pool.query(
      'INSERT INTO room_prices (room_id, price_per_hour, price_per_day) VALUES (?, ?, ?)',
      [room_id, price_per_hour, price_per_day]
    );

    const [[room]] = await pool.query(
      `SELECT r.room_id, r.room_name, r.room_type, r.room_capacity, r.room_status, 
              rp.price_per_hour, rp.price_per_day
       FROM rooms r
       LEFT JOIN room_prices rp ON rp.room_id = r.room_id
       WHERE r.room_id = ?`,
      [room_id]
    );
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create room' });
  }
});

router.put('/status', async (req, res) => {
  try {
    const { room_id, room_status } = req.body;
    await pool.query('UPDATE rooms SET room_status = ? WHERE room_id = ?', [room_status, room_id]);
    res.json({ success: true, data: { room_id, room_status } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { room_id, room_name, room_type, room_capacity, room_status, price_per_hour, price_per_day } = req.body;
    await pool.query(
      'UPDATE rooms SET room_name = ?, room_type = ?, room_capacity = ?, room_status = ? WHERE room_id = ?', 
      [room_name, room_type, room_capacity, room_status, room_id]
    );
    if (typeof price_per_hour !== 'undefined' || typeof price_per_day !== 'undefined') {
      await pool.query(
        'UPDATE room_prices SET price_per_hour = ?, price_per_day = ? WHERE room_id = ?', 
        [price_per_hour, price_per_day, room_id]
      );
    }
    const [[room]] = await pool.query(
      `SELECT r.room_id, r.room_name, r.room_type, r.room_capacity, r.room_status, 
              rp.price_per_hour, rp.price_per_day
       FROM rooms r
       LEFT JOIN room_prices rp ON rp.room_id = r.room_id
       WHERE r.room_id = ?`,
      [room_id]
    );
    res.json({ success: true, data: room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update room' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { room_id } = req.body;
    await pool.query('DELETE FROM rooms WHERE room_id = ?', [room_id]);
    res.json({ success: true, data: { room_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to delete room' });
  }
});

export default router;

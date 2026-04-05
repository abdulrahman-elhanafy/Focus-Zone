import express from 'express';
import { pool, fetchJson } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.id, r.name, r.type, r.capacity, r.status, rp.price_per_hour AS pricePerHour
     FROM rooms r
     LEFT JOIN room_prices rp ON rp.room_id = r.id
     ORDER BY r.name`
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  try {
    const { id, name, type, capacity, pricePerHour, status = 'available' } = req.body;
    const roomId = id || `r${Date.now()}`;

    await pool.query(
      'INSERT INTO rooms (id, name, type, capacity, status) VALUES (?, ?, ?, ?, ?)',
      [roomId, name, type, capacity, status]
    );
    await pool.query(
      'INSERT INTO room_prices (room_id, price_per_hour, price_per_day) VALUES (?, ?, ?)',
      [roomId, pricePerHour, Number(pricePerHour) * 6]
    );

    const [[room]] = await pool.query(
      `SELECT r.id, r.name, r.type, r.capacity, r.status, rp.price_per_hour AS pricePerHour
       FROM rooms r
       LEFT JOIN room_prices rp ON rp.room_id = r.id
       WHERE r.id = ?`,
      [roomId]
    );
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.put('/status', async (req, res) => {
  try {
    const { id, status } = req.body;
    await pool.query('UPDATE rooms SET status = ? WHERE id = ?', [status, id]);
    res.json({ id, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { id, name, type, capacity, status, pricePerHour } = req.body;
    await pool.query('UPDATE rooms SET name = ?, type = ?, capacity = ?, status = ? WHERE id = ?', [name, type, capacity, status, id]);
    if (typeof pricePerHour !== 'undefined') {
      await pool.query('UPDATE room_prices SET price_per_hour = ? WHERE room_id = ?', [pricePerHour, id]);
    }
    const [[room]] = await pool.query(
      `SELECT r.id, r.name, r.type, r.capacity, r.status, rp.price_per_hour AS pricePerHour
       FROM rooms r
       LEFT JOIN room_prices rp ON rp.room_id = r.id
       WHERE r.id = ?`,
      [id]
    );
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update room' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    res.json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;

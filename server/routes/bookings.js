import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.room_id AS roomId, b.customer_id AS customerId,
              c.name AS customerName, r.name AS roomName,
              DATE_FORMAT(b.start_time, '%Y-%m-%dT%H:%i:%s') AS startTime,
              DATE_FORMAT(b.end_time, '%Y-%m-%dT%H:%i:%s') AS endTime,
              b.status, b.total_amount AS totalAmount
       FROM bookings b
       JOIN customers c ON c.id = b.customer_id
       JOIN rooms r ON r.id = b.room_id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.post('/', async (req, res) => {
  const { customerId, roomId, roomName, customerName, startTime, endTime, totalAmount } = req.body;
  const bookingId = `b${Date.now()}`;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query(
      'INSERT INTO bookings (id, customer_id, room_id, start_time, end_time, status, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [bookingId, customerId, roomId, startTime, endTime, 'active', totalAmount]
    );
    await connection.query('UPDATE rooms SET status = ? WHERE id = ?', ['occupied', roomId]);
    await connection.query(
      'INSERT INTO transactions (id, booking_id, customer_id, date, description, category, amount, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        `t${Date.now()}`,
        bookingId,
        customerId,
        new Date().toISOString().split('T')[0],
        `Booking: ${roomName} - ${customerName}`,
        'Income',
        totalAmount,
        'Card',
      ]
    );
    await connection.commit();

    res.status(201).json({
      id: bookingId,
      roomId,
      customerId,
      roomName,
      customerName,
      startTime,
      endTime,
      status: 'active',
      totalAmount,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    connection.release();
  }
});

export default router;

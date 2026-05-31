import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.booking_id, b.customer_id, b.room_id, 
              DATE_FORMAT(b.start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(b.end_time, '%Y-%m-%dT%H:%i:%s') AS end_time,
              b.status, b.total_amount, DATE_FORMAT(b.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
       FROM bookings b
       ORDER BY b.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

router.post('/', async (req, res) => {
  const { customer_id, room_id, start_time, end_time, total_amount, status = 'confirmed' } = req.body;
  const booking_id = `B${Date.now()}`;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    
    await connection.query(
      'INSERT INTO bookings (booking_id, customer_id, room_id, start_time, end_time, status, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [booking_id, customer_id, room_id, start_time, end_time, status, total_amount]
    );
    
    await connection.query('UPDATE rooms SET room_status = ? WHERE room_id = ?', ['reserved', room_id]);
    
    // Insert transaction record
    await connection.query(
      'INSERT INTO transactions (transaction_id, booking_id, customer_id, transaction_date, transaction_description, transaction_category, transaction_amount, transaction_method) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)',
      [`T${Date.now()}`, booking_id, customer_id, `Booking created`, 'Booking', total_amount, 'Cash']
    );
    
    await connection.commit();

    const [[booking]] = await connection.query(
      `SELECT booking_id, customer_id, room_id, 
              DATE_FORMAT(start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(end_time, '%Y-%m-%dT%H:%i:%s') AS end_time,
              status, total_amount, DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%s') AS created_at
       FROM bookings WHERE booking_id = ?`,
      [booking_id]
    );
    
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  } finally {
    connection.release();
  }
});

export default router;

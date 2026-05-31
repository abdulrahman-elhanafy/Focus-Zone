import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// POST create payment
router.post('/', async (req, res) => {
  try {
    const { session_id, payment_method } = req.body;
    const connection = await pool.getConnection();

    await connection.beginTransaction();

    // Get session details
    const [[session]] = await connection.query(
      `SELECT s.session_id, s.customer_id, s.room_id, 
              DATE_FORMAT(s.start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(s.end_time, '%Y-%m-%dT%H:%i:%s') AS end_time
       FROM sessions s WHERE s.session_id = ?`,
      [session_id]
    );

    if (!session) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Get room price
    const [[roomData]] = await connection.query(
      `SELECT rp.price_per_hour FROM room_prices rp WHERE rp.room_id = ?`,
      [session.room_id]
    );

    // Calculate room_amount
    let room_amount = 0;
    if (session.end_time) {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      const durationHours = (endTime - startTime) / (1000 * 60 * 60);
      room_amount = durationHours * (roomData?.price_per_hour || 0);
    }

    // Get session items and calculate items_amount
    const [sessionItems] = await connection.query(
      `SELECT quantity, unit_price FROM session_items WHERE session_id = ?`,
      [session_id]
    );

    const items_amount = sessionItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const total_amount = room_amount + items_amount;

    // Create payment record
    const payment_id = `P${Date.now()}`;
    await connection.query(
      `INSERT INTO payments (payment_id, session_id, room_amount, items_amount, total_amount, payment_method, payment_status, paid_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Paid', NOW())`,
      [payment_id, session_id, room_amount, items_amount, total_amount, payment_method]
    );

    // Create transaction record
    const transaction_id = `T${Date.now()}`;
    await connection.query(
      `INSERT INTO transactions (transaction_id, session_id, customer_id, transaction_date, transaction_description, transaction_category, transaction_amount, transaction_method)
       VALUES (?, ?, ?, CURDATE(), ?, 'Booking', ?, ?)`,
      [transaction_id, session_id, session.customer_id, 'Session payment', total_amount, payment_method]
    );

    await connection.commit();

    // Fetch created payment
    const [[payment]] = await connection.query(
      `SELECT payment_id, session_id, room_amount, items_amount, total_amount, payment_method, payment_status, 
              DATE_FORMAT(paid_at, '%Y-%m-%dT%H:%i:%s') AS paid_at
       FROM payments WHERE payment_id = ?`,
      [payment_id]
    );

    connection.release();
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create payment' });
  }
});

export default router;

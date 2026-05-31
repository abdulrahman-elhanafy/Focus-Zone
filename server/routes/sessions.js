import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET all active sessions
router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT session_id, customer_id, room_id, booking_id, 
              DATE_FORMAT(start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(end_time, '%Y-%m-%dT%H:%i:%s') AS end_time,
              status
       FROM sessions WHERE status = 'active'
       ORDER BY start_time DESC`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch active sessions' });
  }
});

// POST create session (check-in)
router.post('/', async (req, res) => {
  try {
    const { customer_id, room_id, booking_id = null } = req.body;
    const session_id = `S${Date.now()}`;

    await pool.query(
      `INSERT INTO sessions (session_id, customer_id, room_id, booking_id, start_time, status)
       VALUES (?, ?, ?, ?, NOW(), 'active')`,
      [session_id, customer_id, room_id, booking_id]
    );

    const [[session]] = await pool.query(
      `SELECT session_id, customer_id, room_id, booking_id, 
              DATE_FORMAT(start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(end_time, '%Y-%m-%dT%H:%i:%s') AS end_time,
              status
       FROM sessions WHERE session_id = ?`,
      [session_id]
    );
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create session' });
  }
});

// PUT close session (check-out)
router.put('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE sessions SET end_time = NOW(), status = 'completed' WHERE session_id = ?`,
      [id]
    );

    const [[session]] = await pool.query(
      `SELECT session_id, customer_id, room_id, booking_id, 
              DATE_FORMAT(start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(end_time, '%Y-%m-%dT%H:%i:%s') AS end_time,
              status
       FROM sessions WHERE session_id = ?`,
      [id]
    );
    res.json({ success: true, data: session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to close session' });
  }
});

// POST add item to session
router.post('/:id/items', async (req, res) => {
  try {
    const { item_id, quantity } = req.body;
    const { id: session_id } = req.params;

    // Get current item price
    const [[item]] = await pool.query(
      `SELECT item_price FROM items WHERE item_id = ?`,
      [item_id]
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const unit_price = item.item_price;

    // Insert into session_items
    await pool.query(
      `INSERT INTO session_items (session_id, item_id, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [session_id, item_id, quantity, unit_price]
    );

    // Deduct from item_stock
    await pool.query(
      `UPDATE items SET item_stock = item_stock - ? WHERE item_id = ?`,
      [quantity, item_id]
    );

    const [[sessionItem]] = await pool.query(
      `SELECT id, session_id, item_id, quantity, unit_price FROM session_items 
       WHERE session_id = ? AND item_id = ? ORDER BY id DESC LIMIT 1`,
      [session_id, item_id]
    );

    res.status(201).json({ success: true, data: sessionItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add item to session' });
  }
});

// GET session bill (calculate amounts from session data)
router.get('/:id/bill', async (req, res) => {
  try {
    const { id: session_id } = req.params;

    // Get session details
    const [[session]] = await pool.query(
      `SELECT s.session_id, s.customer_id, s.room_id, s.booking_id,
              DATE_FORMAT(s.start_time, '%Y-%m-%dT%H:%i:%s') AS start_time,
              DATE_FORMAT(s.end_time, '%Y-%m-%dT%H:%i:%s') AS end_time,
              s.status
       FROM sessions s WHERE s.session_id = ?`,
      [session_id]
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Get room price
    const [[roomData]] = await pool.query(
      `SELECT rp.price_per_hour FROM room_prices rp WHERE rp.room_id = ?`,
      [session.room_id]
    );

    // Calculate room_amount: time difference × price_per_hour
    let room_amount = 0;
    if (session.end_time) {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      const durationHours = (endTime - startTime) / (1000 * 60 * 60);
      room_amount = durationHours * (roomData?.price_per_hour || 0);
    }

    // Get session items and calculate items_amount
    const [sessionItems] = await pool.query(
      `SELECT id, session_id, item_id, quantity, unit_price FROM session_items WHERE session_id = ?`,
      [session_id]
    );

    const items_amount = sessionItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const total_amount = room_amount + items_amount;

    // Get existing payment if any
    const [[payment]] = await pool.query(
      `SELECT payment_id, payment_method, payment_status, paid_at FROM payments WHERE session_id = ?`,
      [session_id]
    );

    res.json({
      success: true,
      data: {
        session,
        session_items: sessionItems,
        room_amount: parseFloat(room_amount.toFixed(2)),
        items_amount: parseFloat(items_amount.toFixed(2)),
        total_amount: parseFloat(total_amount.toFixed(2)),
        payment: payment || null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch bill' });
  }
});

export default router;

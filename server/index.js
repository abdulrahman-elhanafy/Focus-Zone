import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import customersRoutes from './routes/customers.js';
import employeesRoutes from './routes/employees.js';
import roomsRoutes from './routes/rooms.js';
import itemsRoutes from './routes/items.js';
import bookingsRoutes from './routes/bookings.js';
import sessionsRoutes from './routes/sessions.js';
import paymentsRoutes from './routes/payments.js';
import transactionsRoutes from './routes/transactions.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/transactions', transactionsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`FocusZone backend server is running at http://localhost:${port}`);
});

import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT employee_id, employee_name, employee_email, employee_phone, employee_role, 
              employee_salary, employee_shift, DATE_FORMAT(employee_hire_date, '%Y-%m-%d') AS employee_hire_date, 
              employee_status
       FROM employees ORDER BY employee_name`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [[employee]] = await pool.query(
      `SELECT employee_id, employee_name, employee_email, employee_phone, employee_role, 
              employee_salary, employee_shift, DATE_FORMAT(employee_hire_date, '%Y-%m-%d') AS employee_hire_date, 
              employee_status
       FROM employees WHERE employee_id = ?`,
      [req.params.id]
    );
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { employee_name, employee_email, employee_phone, employee_role, employee_salary, employee_shift } = req.body;
    const employee_id = `E${Date.now()}`;

    await pool.query(
      `INSERT INTO employees (employee_id, employee_name, employee_email, employee_phone, employee_role, 
                              employee_salary, employee_shift, employee_hire_date, employee_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Active')`,
      [employee_id, employee_name, employee_email, employee_phone, employee_role, employee_salary, employee_shift]
    );

    const [[employee]] = await pool.query(
      `SELECT employee_id, employee_name, employee_email, employee_phone, employee_role, 
              employee_salary, employee_shift, DATE_FORMAT(employee_hire_date, '%Y-%m-%d') AS employee_hire_date, 
              employee_status
       FROM employees WHERE employee_id = ?`,
      [employee_id]
    );
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create employee' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { employee_name, employee_email, employee_phone, employee_role, employee_salary, employee_shift, employee_status } = req.body;
    const { id } = req.params;

    await pool.query(
      `UPDATE employees SET employee_name = ?, employee_email = ?, employee_phone = ?, 
                           employee_role = ?, employee_salary = ?, employee_shift = ?, employee_status = ?
       WHERE employee_id = ?`,
      [employee_name, employee_email, employee_phone, employee_role, employee_salary, employee_shift, employee_status, id]
    );

    const [[employee]] = await pool.query(
      `SELECT employee_id, employee_name, employee_email, employee_phone, employee_role, 
              employee_salary, employee_shift, DATE_FORMAT(employee_hire_date, '%Y-%m-%d') AS employee_hire_date, 
              employee_status
       FROM employees WHERE employee_id = ?`,
      [id]
    );
    res.json({ success: true, data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update employee' });
  }
});

export default router;

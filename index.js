require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// List employees
app.get('/api/employees', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, employee_id, full_name, email, department FROM employees ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    const { employee_id, full_name, email, department } = req.body;
    if (!employee_id || !full_name || !email) {
      return res.status(400).json({ error: 'employee_id, full_name and email are required' });
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email' });

    // check duplicate employee_id
    const dup = await db.query('SELECT id FROM employees WHERE employee_id = $1', [employee_id]);
    if (dup.rowCount > 0) return res.status(409).json({ error: 'Employee with this ID already exists' });

    const { rows } = await db.query(
      'INSERT INTO employees (employee_id, full_name, email, department) VALUES ($1,$2,$3,$4) RETURNING id, employee_id, full_name, email, department',
      [employee_id, full_name, email, department || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM employees WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark attendance
app.post('/api/employees/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    if (!date || !status) return res.status(400).json({ error: 'date and status are required' });
    if (!['Present', 'Absent'].includes(status)) return res.status(400).json({ error: 'status must be Present or Absent' });

    const emp = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (emp.rowCount === 0) return res.status(404).json({ error: 'Employee not found' });

    const { rows } = await db.query('INSERT INTO attendance (employee_id, date, status) VALUES ($1,$2,$3) RETURNING id, date, status', [id, date, status]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attendance for employee
app.get('/api/employees/:id/attendance', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, date, status FROM attendance WHERE employee_id = $1 ORDER BY date DESC', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => console.log(`HRMS backend listening on ${port}`));

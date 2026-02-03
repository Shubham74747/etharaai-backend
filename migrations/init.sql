-- init.sql: creates tables for HRMS Lite

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(64) UNIQUE NOT NULL,
  full_name VARCHAR(256) NOT NULL,
  email VARCHAR(256) NOT NULL,
  department VARCHAR(128),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(16) NOT NULL CHECK (status IN ('Present','Absent')),
  created_at TIMESTAMP DEFAULT now()
);

-- simple index
CREATE INDEX IF NOT EXISTS attendance_employee_idx ON attendance(employee_id);

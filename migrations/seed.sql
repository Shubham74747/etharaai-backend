-- seed sample data (idempotent)
INSERT INTO employees (employee_id, full_name, email, department)
VALUES ('E001','Alice Example','alice@example.com','Engineering')
ON CONFLICT (employee_id) DO NOTHING;

INSERT INTO attendance (employee_id, date, status)
SELECT id, current_date - 1, 'Present' FROM employees WHERE employee_id = 'E001' AND NOT EXISTS (SELECT 1 FROM attendance WHERE employee_id = employees.id AND date = current_date - 1);
INSERT INTO attendance (employee_id, date, status)
SELECT id, current_date, 'Absent' FROM employees WHERE employee_id = 'E001' AND NOT EXISTS (SELECT 1 FROM attendance WHERE employee_id = employees.id AND date = current_date);

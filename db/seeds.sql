INSERT INTO departments (name) VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO roles (title, salary, department_id) VALUES
('Engineer', 120000, 1),
('Accountant', 75000, 2),
('Laywer', 80000, 3),
('Sales Associate', 30000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Jayden', 'Taylor', 1, 1),
('Will', 'Smith', 2, NULL),
('Frank', 'jackson', 3, NULL);
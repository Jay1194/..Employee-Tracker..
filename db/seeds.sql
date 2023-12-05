INSERT INTO departments (name) VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales'),
('Marketing'),
('Human Resources'),
('IT'),
('Customer Service');

INSERT INTO roles (title, salary, department_id) VALUES
('Engineer', 120000, 1),
('Accountant', 75000, 2),
('Laywer', 80000, 3),
('Sales Associate', 30000, 4),
('Marketing Specialist', 60000, 5),
('HR Manager', 90000, 6),
('Software Engineer', 110000, 7),
('Customer Representative', 35000, 8);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Jayden', 'Taylor', 1, 1),
('Will', 'Smith', 2, NULL),
('Frank', 'jackson', 3, NULL),
('jane', 'Jill', 4, NULL),
('Emily', 'Williams', 5, 4),
('Michael', 'Jones', 6, 3),
('Sophie', 'Davis', 7, 1),
('Andrew', 'Taylor', 8, 2),
('Grace', 'Clark', 8, 5),
('Daniel', 'Hill', 8, NULL),
('Emma', 'Moore', 8, 7),
('Caleb', 'Baker', 1, 8),
('Hannah', 'Ward', 1, 9),
('David', 'Perry', 2, NULL);
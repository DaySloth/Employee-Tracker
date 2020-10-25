INSERT INTO department(name)
VALUES ('Executive'), ('Accounting'), ('Sales'), ('Human Resources'), ('Warehouse'), ('Maintenance');

INSERT INTO role(title, salary, department_id)
VALUES ('CEO', 5000000, 1), ('CFO', 2000000, 2), ('Lead Accountant', 100000, 2), ('Accountant', 80000, 2), ('Lead Salesman', 200000, 3), ('Salesman', 100000, 3),
('Lead HR', 70000, 4), ('HR Rep', 55000, 4), ('Warehouse Manger', 60000, 5), ('Stocker', 40000, 5), ('Maint Manager', 50000, 6), ('Maint Tech', 40000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
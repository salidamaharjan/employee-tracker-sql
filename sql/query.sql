SELECT * FROM role
RIGHT JOIN department ON role.department_id = department.id;

SELECT * FROM employee
RIGHT JOIN role ON employee.role_id = role.id;

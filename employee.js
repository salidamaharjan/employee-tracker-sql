const { printTable } = require("console-table-printer");
const inquirer = require('inquirer');

async function viewAllEmployee(db) {
  const [employees] = await db.query(`
      SELECT 
          employee.id As 'Employee ID', 
          employee.first_name AS 'First Name',
          employee.last_name AS 'Last Name',
          role.title AS Role,
          role.salary AS Salary,
          department.name AS 'Department Name',
          CONCAT(manager.first_name,' ',manager.last_name) AS Manager
       FROM employee
        INNER JOIN role
          ON role.id = employee.role_id
        INNER JOIN department
          ON department.id = role.department_id
        LEFT JOIN employee manager
          ON employee.manager_id = manager.id
        ORDER BY employee.id
       `);
  printTable(employees);
}

async function addEmployee(db) {
    const [employeeRoles] = await db.query("SELECT id, title FROM role");
      // console.log(employeeRoles);
      const [employeeManagers] = await db.query(
        "SELECT id, first_name, last_name FROM employee"
      );
      const employeeManagerChoice = employeeManagers.map((manager) => {
        return `${manager.first_name} ${manager.last_name}`;
      });
      employeeManagerChoice.push("NONE");

      const { firstName, lastName, employeeRole, employeeManager } =
        await inquirer.prompt([
          {
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "lastName",
            type: "input",
            message: "What is the employees's last name?",
          },
          {
            name: "employeeRole",
            type: "list",
            message: "What is the employee's role?",
            choices: employeeRoles.map((employee) => {
              return employee.title;
            }),
          },
          {
            name: "employeeManager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: employeeManagerChoice,
          },
        ]);
      const { id: employeeRoleID } = employeeRoles.find((item) => {
        return item.title === employeeRole;
      });
      const { id: managerId } =
        employeeManagers.find((item) => {
          // console.log("employeeManager", employeeManager);
          // console.log(item.first_name + " " + item.last_name);
          const employeeFullName = item.first_name + " " + item.last_name;
          return employeeFullName === employeeManager;
        }) || {};
      const employeeTable =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      const employeeValues = [
        firstName,
        lastName,
        employeeRoleID,
        employeeManager === "NONE" ? null : managerId,
      ];
      await db.execute(employeeTable, employeeValues);
      console.log("Employee added");
}

async function updateEmployeeRole(db) {
    const [employeeNames] = await db.query(
        "SELECT id, first_name, last_name FROM employee"
      );
      const [roleEmployees] = await db.query("SELECT id, title FROM role");
      const employeeName = employeeNames.map((name) => {
        return `${name.first_name} ${name.last_name}`;
      });
      // console.log(roleEmployees);
      // console.log(employeeNames);
      const { nameEmployee, toRole } = await inquirer.prompt([
        {
          name: "nameEmployee",
          type: "list",
          message: "Which employee role you want to update?",
          choices: employeeName,
        },
        {
          name: "toRole",
          type: "list",
          message: "Which role do you want to assign the selected employee?",
          choices: roleEmployees.map((employee) => {
            return employee.title;
          }),
        },
      ]);
      const { id: employeeID } = employeeNames.find((item) => {
        const employeeFullName = item.first_name + " " + item.last_name;
        return employeeFullName === nameEmployee;
      });
      const { id: roleID } = roleEmployees.find((item) => {
        return item.title === toRole;
      });
      console.log(employeeID);
      console.log(roleID);
      const updatedEmployeeTable =
        "UPDATE employee SET role_id = ? WHERE id = ?";
      const valuesUpdate = [roleID, employeeID];
      await db.execute(updatedEmployeeTable, valuesUpdate);
      console.log("Employee Role updated");
}
module.exports = { viewAllEmployee, addEmployee, updateEmployeeRole };

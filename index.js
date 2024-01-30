// importing inquirer
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
displayQuestion();

/**
 * function created to display question and get the user choice
 */
async function displayQuestion() {
  const db = await createConnection();
  // using object destructuring to extract user choice
  const { choices } = await inquirer.prompt([
    {
      name: "choices",
      type: "list",
      message: "What do you want to do?",
      choices: [
        "View All Employee",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
      ],
    },
  ]);
  // console.log(choices);
  switch (choices) {
    case "View All Employee":
      const [employees] = await db.query("SELECT * FROM employee");
      console.table(employees);
      break;

    case "Add Employee":
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
      const { id: managerId } = employeeManagers.find((item) => {
        // console.log("employeeManager", employeeManager);
        // console.log(item.first_name + " " + item.last_name);
        const employeeFullName = item.first_name + " " + item.last_name;
        return employeeFullName === employeeManager;
      });
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
      break;

    case "Update Employee Role":
      const [employeeNames] = await db.query("SELECT id, first_name, last_name FROM employee")
      const [roleEmployees] = await db.query("SELECT id, title FROM role");
      const employeeName = employeeNames.map((name) => {
        return `${name.first_name} ${name.last_name}`;
      });
      // console.log(roleEmployees);
      // console.log(employeeNames);
     const { nameEmployee, toRole} = await inquirer.prompt([
        {
          name: "nameEmployee",
          type: "list",
          message: "Which employee role you want to update?",
          choices: employeeName
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
      const {id: employeeID} = employeeNames.find((item) => {
        const employeeFullName = item.first_name + " " + item.last_name;
        return employeeFullName === nameEmployee;
      });
      const {id: roleID} = roleEmployees.find((item) => {
        return item.title === toRole;
      });
      console.log(employeeID);
      console.log(roleID);
      const updatedEmployeeTable = ("UPDATE employee SET role_id = ? WHERE id = ?");
      const valuesUpdate = [roleID, employeeID];
      await db.execute(updatedEmployeeTable, valuesUpdate);
      console.log("Employee Role updated");
      break;

    case "Add Department":
      const { departmentName } = await inquirer.prompt([
        {
          name: "departmentName",
          type: "input",
          message: "Enter department name?",
        },
      ]);
      // console.log(departmentName);
      // using prepared statement to insert the name of department to db
      const sql = "INSERT INTO department (name) VALUES (?)";
      const values = [departmentName];
      await db.execute(sql, values);
      console.log("Department inserted");
      break;

    case "View All Departments":
      const [departments] = await db.query("SELECT * FROM department");
      console.table(departments);
      break;

    case "View All Roles":
      const [roles] = await db.query("SELECT * FROM role");
      console.table(roles);
      break;

    case "Add Role":
      const [roleDepartments] = await db.query("SELECT * FROM department");
      const { role, salary, roleDepartment } = await inquirer.prompt([
        {
          name: "role",
          type: "input",
          message: "What is the name of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role?",
        },
        {
          name: "roleDepartment",
          type: "list",
          message: "Which department does the role belong to?",
          choices: roleDepartments,
        },
      ]);
      const { id } = roleDepartments.find((department) => {
        return department.name === roleDepartment;
      });
      const roleTable =
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
      const roleValues = [role, salary, id];
      await db.execute(roleTable, roleValues);
      console.log("Role added");
      break;
  }
  displayQuestion();
}

async function createConnection() {
  const db = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "employee_tracker_db",
  });
  return db;
}

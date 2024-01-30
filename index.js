// importing inquirer
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const { printTable } = require("console-table-printer");
const { viewAllDepartments, addDepartment } = require("./department.js");
const { viewAllEmployee, addEmployee, updateEmployeeRole} = require("./employee.js");

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
        "Quit",
      ],
    },
  ]);
  // console.log(choices);
  switch (choices) {
    case "View All Employee":
      await viewAllEmployee(db);
      break;

    case "Add Employee":
      await addEmployee(db);
      break;

    case "Update Employee Role":
      await updateEmployeeRole(db);
      break;

    case "Add Department":
      await addDepartment(db);
      break;

    case "View All Departments":
      await viewAllDepartments(db);
      break;

    case "View All Roles":
      const [roles] = await db.query(`
        SELECT 
          role.id AS 'Role ID', 
          role.title AS 'Role Title', 
          role.salary AS Salary, 
          department.name AS 'Department Name'
      FROM role
        INNER JOIN department 
          ON role.department_id = department.id
      `);
      printTable(roles);
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

    case "Quit":
      console.log("BYE BYE");
      process.exit();
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

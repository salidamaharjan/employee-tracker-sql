// importing files
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const { viewAllDepartments, addDepartment } = require("./department.js");
const {
  viewAllEmployee,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeeByManager
} = require("./employee.js");
const { viewAllRoles, addRole } = require("./role.js");

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
        "Update Employee Manager",
        "View Employee By Manager",
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
    
    case "View Employee By Manager":
      await viewEmployeeByManager(db);
      break;

    case "Add Department":
      await addDepartment(db);
      break;

    case "View All Departments":
      await viewAllDepartments(db);
      break;

    case "View All Roles":
      await viewAllRoles(db);
      break;

    case "Add Role":
      await addRole(db);
      break;

    case "Update Employee Manager":
      await updateEmployeeManager(db);
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

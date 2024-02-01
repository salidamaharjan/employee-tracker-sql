// importing files
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const { viewAllDepartments, addDepartment, deleteDepartment, viewTotalUtilizedBudgetOfDepartment } = require("./department.js");
const {
  viewAllEmployee,
  addEmployee,
  deleteEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeeByManager, 
  viewEmployeesByDepartment
} = require("./employee.js");
const { viewAllRoles, addRole, deleteRole } = require("./role.js");

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
        "Delete Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View Employee By Manager",
        "View All Roles",
        "Add Role",
        "Delete Role",
        "View All Departments",
        "View Employees By Department",
        "Add Department",
        "Delete Department",
        "View Total Utilized Budget of Department",
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

    case "Delete Employee":
      await deleteEmployee(db);
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

    case "View Employees By Department":
      await viewEmployeesByDepartment(db);
    break;

    case "View All Roles":
      await viewAllRoles(db);
      break;

    case "Add Role":
      await addRole(db);
      break;

    case "Delete Role":
      await deleteRole(db);
    break;

    case "Update Employee Manager":
      await updateEmployeeManager(db);
      break;

    case "Delete Department":
     await deleteDepartment(db);
    break;

    case "View Total Utilized Budget of Department":
      await viewTotalUtilizedBudgetOfDepartment(db);
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

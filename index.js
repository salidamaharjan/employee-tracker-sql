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
        "Add a department",
        "View all department",
        "View role",
        "Add role",
      ],
    },
  ]);
  // console.log(choices);
  switch (choices) {
    case "Add a department":
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
    case "View all department":
      const [departments] = await db.query("SELECT * FROM department");
      console.table(departments);
      break;
    case "View role":
      const [roles] = await db.query("SELECT * FROM role");
      console.table(roles);
      break;
    case "Add role":
      const [roleDepartments] = await db.query("SELECT * FROM department");      
     const {role, salary, roleDepartment} = await inquirer.prompt([
        {
          name: "role",
          type: "input",
          message: "What is the name of the role?"
        },{
          name: "salary",
          type: "input",
          message: "What is the salary of the role?"
        },{
          name: "roleDepartment",
          type: "list",
          message: "Which department does the role belong to?",
          choices: roleDepartments
        }
      ]);
     const { id } = roleDepartments.find((department) => {
        return department.name === roleDepartment
      });
      const roleTable = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
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

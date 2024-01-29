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
      choices: ["Add a department", "View all department"],
    },
  ]);
  console.log(choices);
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
      const [result] = await db.query("SELECT * FROM department");
      console.table(result);
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

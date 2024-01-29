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
      console.log(employeeRoles);
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
            choices: "",
          },
        ]);
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

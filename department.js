const { printTable } = require("console-table-printer");
const inquirer = require("inquirer");

// view all department in the database
async function viewAllDepartments(db) {
  //array destructuring used to get all the departments
  //getting id and name column from department table
  const [departments] = await db.query(`
      SELECT 
          department.id AS 'Department ID',
          department.name AS 'Department Name'
        FROM department`);
  //printing as a table of all available departments.
  printTable(departments);
}

async function addDepartment(db) {
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
}

async function deleteDepartment(db) {
  const [departs] = await db.query("SELECT id, name FROM department");
  // console.log(departs);
  const departName = departs.map((item) => item.name);
  // console.log(departName);
  const { department } = await inquirer.prompt([
    {
      name: "department",
      type: "list",
      message: "Which department do you want to remove?",
      choices: departName,
    },
  ]);
  // only getting id from the departments
  const { id: departId } = departs.find((item) => item.name === department);
  console.log(departId);
 
  //deleting the department which has the id value in departId
  const deleteQuery = `
  DELETE FROM department
  WHERE id = ? `;

  const idValue = [departId];
  await db.execute(deleteQuery, idValue);
  console.log(`${department} has been deleted`)
}

async function viewTotalUtilizedBudgetOfDepartment(db) {
  const [ departObj ] = await db.query(`SELECT department.id, department.name
  FROM department`);
  // console.log(departObj);
  const departNames = departObj.map((item) => item.name);
  // console.log(departNames);
  const { selectedDepart } = await inquirer.prompt([
    {
      name: "selectedDepart",
      message: "Choose a department to view total utilized budget",
      type: "list",
      choices: departNames
    }
  ]);
  // console.log(selectedDepart);
  const {id: departId} = departObj.find((item) => selectedDepart === item.name);
  // console.log(departId);
  const budgetByDepartQuery = `
  SELECT d.id AS ID, SUM(salary) AS Budget ,d.name AS Department
  FROM role
    INNER JOIN department d 
      ON ROLE.department_id = d.id 
  WHERE d.id = ?
  GROUP BY role.department_id
  `
  const departIDValue = [ departId ];
  const [ budgetTable ] = await db.execute(budgetByDepartQuery, departIDValue);
  printTable(budgetTable);
}

module.exports = { viewAllDepartments, addDepartment, deleteDepartment, viewTotalUtilizedBudgetOfDepartment };

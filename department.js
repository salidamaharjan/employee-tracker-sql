const { printTable } = require("console-table-printer");
const inquirer = require("inquirer");

async function viewAllDepartments(db) {
  const [departments] = await db.query(`
      SELECT 
          department.id AS 'Department ID',
          department.name AS 'Department Name'
        FROM department`);
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
  const { id: departId } = departs.find((item) => item.name === department);
  console.log(departId);

  const deleteQuery = `
  DELETE FROM department
  WHERE id = ? `;

  const idValue = [departId];
  await db.execute(deleteQuery, idValue);
  console.log(`${department} has been deleted`)
}

module.exports = { viewAllDepartments, addDepartment, deleteDepartment };

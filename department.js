const { printTable } = require("console-table-printer");
const inquirer = require('inquirer');

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

module.exports = { viewAllDepartments, addDepartment};

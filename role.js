const { printTable } = require("console-table-printer");
const inquirer = require('inquirer');

async function viewAllRoles(db) {
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
}
async function addRole(db) {
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
}

async function deleteRole(db) {
  const [ roleTableAsArray ] = await db.query(`
  SELECT id, title FROM role`);
  // console.log(roleTableAsArray);

  const titles = roleTableAsArray.map((item) => item.title);
  // console.log(titles);

  const { selectedRole } = await inquirer.prompt([
    {
      name: "selectedRole",
      type: "list",
      message: "Which role you want to delete?",
      choices: titles
    }
  ]);
  // console.log(selectedRole);
  const { id: roleId } = roleTableAsArray.find((item) => item.title === selectedRole);
  // console.log(roleId);
  const deleteRoleQuery = `DELETE FROM role
  WHERE id = ?`;
  const idValue = [ roleId ];
  await db.execute(deleteRoleQuery, idValue);
  console.log(`${selectedRole} has been deleted`);
}

module.exports = { viewAllRoles, addRole, deleteRole};

const { printTable } = require("console-table-printer");

async function viewAllDepartments(db) {
  const [departments] = await db.query(`
      SELECT 
          department.id AS 'Department ID',
          department.name AS 'Department Name'
        FROM department`);
  printTable(departments);
}

module.exports = { viewAllDepartments };

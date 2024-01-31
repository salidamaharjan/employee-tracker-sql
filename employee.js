const { printTable } = require("console-table-printer");
const inquirer = require("inquirer");

async function viewAllEmployee(db) {
  const [employees] = await db.query(`
      SELECT 
          employee.id As 'Employee ID', 
          employee.first_name AS 'First Name',
          employee.last_name AS 'Last Name',
          role.title AS Role,
          role.salary AS Salary,
          department.name AS 'Department Name',
          CONCAT(manager.first_name,' ',manager.last_name) AS Manager
       FROM employee
        INNER JOIN role
          ON role.id = employee.role_id
        INNER JOIN department
          ON department.id = role.department_id
        LEFT JOIN employee manager
          ON employee.manager_id = manager.id
        ORDER BY employee.id
       `);
  printTable(employees);
}

async function addEmployee(db) {
  const [employeeRoles] = await db.query("SELECT id, title FROM role");
  // console.log(employeeRoles);
  const [employeeManagers] = await db.query(
    "SELECT id, first_name, last_name FROM employee"
  );
  const employeeManagerChoice = employeeManagers.map((manager) => {
    return `${manager.first_name} ${manager.last_name}`;
  });
  employeeManagerChoice.push("NONE");

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
        choices: employeeManagerChoice,
      },
    ]);
  const { id: employeeRoleID } = employeeRoles.find((item) => {
    return item.title === employeeRole;
  });
  const { id: managerId } =
    employeeManagers.find((item) => {
      // console.log("employeeManager", employeeManager);
      // console.log(item.first_name + " " + item.last_name);
      const employeeFullName = item.first_name + " " + item.last_name;
      return employeeFullName === employeeManager;
    }) || {};
  const employeeTable =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  const employeeValues = [
    firstName,
    lastName,
    employeeRoleID,
    employeeManager === "NONE" ? null : managerId,
  ];
  await db.execute(employeeTable, employeeValues);
  console.log("Employee added");
}

async function updateEmployeeRole(db) {
  const [employeeNames] = await db.query(
    "SELECT id, first_name, last_name FROM employee"
  );
  const [roleEmployees] = await db.query("SELECT id, title FROM role");
  const employeeName = employeeNames.map((name) => {
    return `${name.first_name} ${name.last_name}`;
  });
  // console.log(roleEmployees);
  // console.log(employeeNames);
  const { nameEmployee, toRole } = await inquirer.prompt([
    {
      name: "nameEmployee",
      type: "list",
      message: "Which employee role you want to update?",
      choices: employeeName,
    },
    {
      name: "toRole",
      type: "list",
      message: "Which role do you want to assign the selected employee?",
      choices: roleEmployees.map((employee) => {
        return employee.title;
      }),
    },
  ]);
  const { id: employeeID } = employeeNames.find((item) => {
    const employeeFullName = item.first_name + " " + item.last_name;
    return employeeFullName === nameEmployee;
  });
  const { id: roleID } = roleEmployees.find((item) => {
    return item.title === toRole;
  });
  console.log(employeeID);
  console.log(roleID);
  const updatedEmployeeTable = "UPDATE employee SET role_id = ? WHERE id = ?";
  const valuesUpdate = [roleID, employeeID];
  await db.execute(updatedEmployeeTable, valuesUpdate);
  console.log("Employee Role updated");
}

async function updateEmployeeManager(db) {
  const [employeeManagers] = await db.query(
    "SELECT id, first_name, last_name FROM employee"
  );

  const employeeChoice = employeeManagers.map((manager) => {
    return `${manager.first_name} ${manager.last_name}`;
  });
  employeeChoice.push("NONE");

  const { selectedName, newManager } = await inquirer.prompt([
    {
      name: "selectedName",
      message: "Which employee's manager you want to update?",
      type: "list",
      choices: employeeChoice,
    },
    {
      name: "newManager",
      message: "Which employee you want to choose as a manager?",
      type: "list",
      choices: employeeChoice,
    },
  ]);
  // console.log(selectedName);
  // console.log(newManager);

  const { id: selectedNameId } = employeeManagers.find(
    (item) => `${item.first_name} ${item.last_name}` === selectedName
  );
  const { id: newManagerId } =
    employeeManagers.find((item) => {
      const employeeFullName = `${item.first_name} ${item.last_name}`;
      return employeeFullName === newManager;
    }) || {};

  // console.log(selectedNameId, newManagerId);

  const updatedManager = "UPDATE employee SET manager_id = ? WHERE id = ? ";
  const updateValueForManager = [
    newManager === "NONE" ? null : newManagerId,
    selectedNameId,
  ];

  await db.execute(updatedManager, updateValueForManager);
  console.log("Manager Updated");
}

async function viewEmployeeByManager(db) {
  const [employees] = await db.query(`
  SELECT manager.id, 
         CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
  FROM employee manager
    INNER JOIN employee
      ON manager.id = employee.manager_id
  `);

  const { managerName } = await inquirer.prompt([
    {
      name: "managerName",
      type: "list",
      message: "Choose a manager to view the employees working under?",
      choices: employees.map((item) => item.manager_name),
    },
  ]);
  // console.log(managerName); //Salida M
  const { id: managerId } = employees.find(
    (item) => item.manager_name === managerName
  );
  // console.log(managerId); //1

  const employeeWithSelectedManagerQuery= `
  SELECT 
    employee.id As 'Employee ID', 
    employee.first_name AS 'First Name',
    employee.last_name AS 'Last Name',
    role.title AS Role,
    role.salary AS Salary,
    department.name AS 'Department Name',
    CONCAT(manager.first_name,' ',manager.last_name) AS Manager
  FROM employee
  INNER JOIN role
    ON role.id = employee.role_id
  INNER JOIN department
    ON department.id = role.department_id
  LEFT JOIN employee manager
    ON employee.manager_id = manager.id
  WHERE employee.manager_id = ?
  ORDER BY employee.id
  `;
  const managerIdValue = [ managerId ] 
  const [ managersEmployee ]= await db.execute(employeeWithSelectedManagerQuery, managerIdValue);
  console.log(`Employee under ${managerName}`);
  printTable(managersEmployee);
}

async function viewEmployeesByDepartment(db) {
  const [ departments ] = await db.query(`
  SELECT * from department`
  );
  const departmentNames = departments.map((item) => item.name); 

  // console.log(departments); 
  // console.log(departmentNames);
const { department } = await inquirer.prompt([
  {
    name: "department",
    type: "list",
    message: "Which department do you want to choose?",
    choices: departmentNames
  }
]);

const showEmployeeByDepartQuery = `
SELECT 
    employee.id As 'Employee ID', 
    employee.first_name AS 'First Name',
    employee.last_name AS 'Last Name',
    role.title AS Role,
    role.salary AS Salary,
    department.name AS 'Department Name',
    CONCAT(manager.first_name,' ',manager.last_name) AS Manager
  FROM employee
  INNER JOIN role
    ON role.id = employee.role_id
  INNER JOIN department
    ON department.id = role.department_id
  LEFT JOIN employee manager
    ON employee.manager_id = manager.id
  WHERE department.id = ?
  ORDER BY employee.id
`
const {id: departmentID} = departments.find((item) => item.name === department );
const departmentIdValue = [departmentID]
const [ employeeByDepartment ] = await db.execute(showEmployeeByDepartQuery, departmentIdValue);
console.log(`Employee under ${department}`);
printTable(employeeByDepartment);
}

module.exports = {
  viewAllEmployee,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeeByManager,
  viewEmployeesByDepartment
};

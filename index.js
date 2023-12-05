const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// Function to handle user input and execute corresponding database queries
async function manageDatabase() {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View departments',
      'View roles',
      'View employees',
      'Update employee managers',
      'View employees by manager',
      'View employees by department',
      'Delete department',
      'Delete role',
      'Delete employee',
      'View total utilized budget',
      'Exit',
    ],
  });

  switch (action) {
    case 'View departments':
      viewDepartments();
      break;

    case 'View roles':
      viewRoles();
      break;

    case 'View employees':
      viewEmployees();
      break;

    case 'Update employee managers':
      await updateEmployeeManager();
      break;

    case 'View employees by manager':
      await viewEmployeesByManager();
      break;

    case 'View employees by department':
      await viewEmployeesByDepartment();
      break;

    case 'Delete department':
      await deleteDepartment();
      break;

    case 'Delete role':
      await deleteRole();
      break;

    case 'Delete employee':
      await deleteEmployee();
      break;

    case 'View total utilized budget':
      await viewTotalUtilizedBudget();
      break;

    case 'Exit':
      console.log('Goodbye!');
      db.end(); // Close the database connection before exiting
      break;

    default:
      console.log('Invalid option. Please try again.');
      manageDatabase();
      break;
  }
}

// Function to view departments
function viewDepartments() {
  const query = 'SELECT * FROM departments';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }

    console.table(results);
    manageDatabase(); // Go back to the main menu after displaying results
  });
}

// Function to view roles
function viewRoles() {
  const roleQuery = 'SELECT * FROM roles';

  db.query(roleQuery, (err, roleResults) => {
    if (err) {
      console.error('Error executing role query:', err);
      return;
    }

    console.table(roleResults);
    manageDatabase(); // Go back to the main menu after displaying results
  });
}

// Function to view employees
function viewEmployees() {
  const employeeQuery = 'SELECT * FROM employees';

  db.query(employeeQuery, (err, employeeResults) => {
    if (err) {
      console.error('Error executing employee query:', err);
      return;
    }

    console.table(employeeResults);
    manageDatabase(); // Go back to the main menu after displaying results
  });
}

// Function to update employee managers
async function updateEmployeeManager() {
  const employees = await getEmployeeChoices();
  const { employeeId } = await inquirer.prompt({
    type: 'list',
    name: 'employeeId',
    message: 'Select the employee whose manager you want to update:',
    choices: employees,
  });

  const managers = await getManagerChoices();
  const { managerId } = await inquirer.prompt({
    type: 'list',
    name: 'managerId',
    message: 'Select the new manager for the employee:',
    choices: managers,
  });

  const updateQuery = 'UPDATE employees SET manager_id = ? WHERE id = ?';
  db.query(updateQuery, [managerId, employeeId], (err, result) => {
    if (err) {
      console.error('Error updating employee manager:', err);
      return;
    }

    console.log('Employee manager updated successfully!');
    manageDatabase();
  });
}

// Function to view employees by manager
async function viewEmployeesByManager() {
  const managers = await getManagerChoices();
  const { managerId } = await inquirer.prompt({
    type: 'list',
    name: 'managerId',
    message: 'Select the manager to view employees:',
    choices: managers,
  });

  const query = 'SELECT * FROM employees WHERE manager_id = ?';
  db.query(query, [managerId], (err, results) => {
    if (err) {
      console.error('Error executing employee query:', err);
      return;
    }

    console.table(results);
    manageDatabase();
  });
}

// Function to view employees by department
async function viewEmployeesByDepartment() {
  const departments = await getDepartmentChoices();
  const { departmentId } = await inquirer.prompt({
    type: 'list',
    name: 'departmentId',
    message: 'Select the department to view employees:',
    choices: departments,
  });

  const query = 'SELECT * FROM employees WHERE role_id IN (SELECT id FROM roles WHERE department_id = ?)';
  db.query(query, [departmentId], (err, results) => {
    if (err) {
      console.error('Error executing employee query:', err);
      return;
    }

    console.table(results);
    manageDatabase();
  });
}

// Function to delete department
async function deleteDepartment() {
  const departments = await getDepartmentChoices();
  const { departmentId } = await inquirer.prompt({
    type: 'list',
    name: 'departmentId',
    message: 'Select the department to delete:',
    choices: departments,
  });

  // Check if the department has roles before deletion
  const rolesInDepartment = await getRolesInDepartment(departmentId);
  if (rolesInDepartment.length > 0) {
    console.log('Cannot delete department. Roles are associated with it.');
    manageDatabase();
    return;
  }

  const deleteQuery = 'DELETE FROM departments WHERE id = ?';
  db.query(deleteQuery, [departmentId], (err, result) => {
    if (err) {
      console.error('Error deleting department:', err);
      return;
    }

    console.log('Department deleted successfully!');
    manageDatabase();
  });
}

// Function to delete role
async function deleteRole() {
  const roles = await getRoleChoices();
  const { roleId } = await inquirer.prompt({
    type: 'list',
    name: 'roleId',
    message: 'Select the role to delete:',
    choices: roles,
  });

  // Check if the role has employees before deletion
  const employeesWithRole = await getEmployeesWithRole(roleId);
  if (employeesWithRole.length > 0) {
    console.log('Cannot delete role. Employees are associated with it.');
    manageDatabase();
    return;
  }

  const deleteQuery = 'DELETE FROM roles WHERE id = ?';
  db.query(deleteQuery, [roleId], (err, result) => {
    if (err) {
      console.error('Error deleting role:', err);
      return;
    }

    console.log('Role deleted successfully!');
    manageDatabase();
  });
}

// Function to delete employee
async function deleteEmployee() {
  const employees = await getEmployeeChoices();
  const { employeeId } = await inquirer.prompt({
    type: 'list',
    name: 'employeeId',
    message: 'Select the employee to delete:',
    choices: employees,
  });

  const deleteQuery = 'DELETE FROM employees WHERE id = ?';
  db.query(deleteQuery, [employeeId], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return;
    }

    console.log('Employee deleted successfully!');
    manageDatabase();
  });
}

// Function to view the total utilized budget of a department
async function viewTotalUtilizedBudget() {
  const departments = await getDepartmentChoices();
  const { departmentId } = await inquirer.prompt({
    type: 'list',
    name: 'departmentId',
    message: 'Select the department to view the total utilized budget:',
    choices: departments,
  });

  const budgetQuery = 'SELECT SUM(salary) AS total_budget FROM roles WHERE department_id = ?';
  db.query(budgetQuery, [departmentId], (err, result) => {
    if (err) {
      console.error('Error calculating total utilized budget:', err);
      return;
    }

    console.log(`Total Utilized Budget for the selected department: $${result[0].total_budget}`);
    manageDatabase();
  });
}

// Function to get a list of roles in a department
async function getRolesInDepartment(departmentId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM roles WHERE department_id = ?';
    db.query(query, [departmentId], (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

// Function to get a list of employees with a specific role
async function getEmployeesWithRole(roleId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM employees WHERE role_id = ?';
    db.query(query, [roleId], (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

// Function to get a list of department choices
async function getDepartmentChoices() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, name FROM departments';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const choices = results.map((department) => ({
        value: department.id,
        name: department.name,
      }));
      resolve(choices);
    });
  });
}

// Function to get a list of role choices
async function getRoleChoices() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, title AS name FROM roles';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const choices = results.map((role) => ({
        value: role.id,
        name: role.name,
      }));
      resolve(choices);
    });
  });
}

// Function to get a list of employee choices
async function getEmployeeChoices() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const choices = results.map((employee) => ({
        value: employee.id,
        name: employee.name,
      }));
      resolve(choices);
    });
  });
}

// Function to get a list of manager choices
async function getManagerChoices() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees WHERE manager_id IS NULL';
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      const choices = results.map((manager) => ({
        value: manager.id,
        name: manager.name,
      }));
      resolve(choices);
    });
  });
}

// Start the application
manageDatabase();
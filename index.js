const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// Function to handle user input and execute corresponding database queries
async function manageDatabase() {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View departments', 'View roles', 'View employees', 'Exit'],
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

// Start the application
manageDatabase();
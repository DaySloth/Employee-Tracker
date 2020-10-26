const inquirer = require("inquirer");

function askQuestion(question, arrayA, arrayB) {
    switch (question) {
        case "Add Departments":
            return inquirer.prompt([
                {
                    type: "input",
                    name: "deptName",
                    message: "What is the department name?"
                }
            ]);

        case "Add Roles":
            return inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the role title?"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Salary for this role?"
                },
                {
                    type: "list",
                    name: "dept",
                    message: "What department does this belong to?",
                    choices: arrayA
                },
            ]);

        case "Add Employees":
            return inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "First Name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Last Name?"
                },
                {
                    type: "list",
                    name: "role",
                    message: "What is their role?",
                    choices: arrayA
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Who is their Manager?",
                    choices: arrayB
                }
            ]);

        case "Update Employee Roles":
            return inquirer.prompt([
                {
                    type: "list",
                    message: "Who would you like to update roles for?",
                    name: "employee",
                    choices: arrayA
                }
            ]);

        case "Update Employee Managers":
            return inquirer.prompt([
                {
                    type: "list",
                    message: "Who would you like to update the manager for?",
                    name: "employee",
                    choices: arrayA
                },
                {
                    type: "list",
                    message: "Who would you like their new manager to be?",
                    name: "newManager",
                    choices: arrayA
                }
            ]);

        case "View Employees by Manager":
            return inquirer.prompt([
                {
                    type: "list",
                    message: "What manager would you like to view employees for?",
                    name: "managerName",
                    choices: arrayA
                }
            ]);

        case "Delete Departments":
            return inquirer.prompt([
                {
                    type: "list",
                    message: "What department would you like to delete?",
                    name: "deptName",
                    choices: arrayA
                },
                {
                    type: "list",
                    message: "Are you SURE? This will delete all roles and employee associated with this Dept!!",
                    name: "isSure",
                    choices: ["Yes", "No"]
                }
            ]);

        case "Delete Roles":
            return inquirer.prompt([
                {
                    type: "list",
                    message: "What role would you like to delete?",
                    name: "roleName",
                    choices: arrayA
                },
                {
                    type: "list",
                    message: "Are you SURE? This will delete all employees associated with this Role!!",
                    name: "isSure",
                    choices: ["Yes", "No"]
                }
            ]);

        case "Delete Employee":
            return inquirer.prompt([
                {
                    type: "list",
                    message: "What employee would you like to delete?",
                    name: "employeeName",
                    choices: arrayA
                },
                {
                    type: "list",
                    message: "Are you SURE? This will delete this employee!!",
                    name: "isSure",
                    choices: ["Yes", "No"]
                }
            ]);

        default:
            return "HIT THE DEFAULT"
    }
};

module.exports = askQuestion;
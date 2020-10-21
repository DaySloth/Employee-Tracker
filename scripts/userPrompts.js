const inquirer = require("inquirer");

function askQuestion(question, arrayA, arrayB){
    switch(question){
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

        default:
            return "HIT THE DEFAULT"
    }
};

module.exports = askQuestion;
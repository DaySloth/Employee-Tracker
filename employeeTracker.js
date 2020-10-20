const connection = require("./scripts/dbConnection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const sqlQueries = require("./scripts/sqlQueries");
const util = require("util");

let deptArray = [];
let deptNameArray = [];

function getDept(initRes) {
    connection.query("SELECT * FROM department", function (error, response) {
        deptArray = [];

        deptNameArray = response.map(element => element.name);
        response.forEach(element => {
            deptArray.push({
                id: element.id,
                name: element.name
            })
        });
        handleChoices(initRes);
    });
};

function init() {
    return inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "selection",
            choices: ["Add Departments", "Add Roles", "Add Employees", "View Departments", "View Roles", "View Employees", "Update Employee Roles", "EXIT"]
        }
    ]);
};

function handleChoices(choice) {
    if (choice.selection === "Add Departments") {
        inquirer.prompt([
            {
                type: "input",
                name: "deptName",
                message: "What is the department name?"
            }
        ]).then(function (response) {
            console.log(`Adding '${response.deptName}' to database`);
            sqlQueries({ choice: choice.selection, deptName: response.deptName });
            init().then(getDept);
        });
    } else if (choice.selection === "Add Roles") {
        inquirer.prompt([
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
                choices: deptNameArray
            },
        ]).then(function (response) {
            deptArray.forEach(element => {
                if (element.name === response.dept) {
                    response.departmentId = element.id
                }
            });
            console.log("hitting sql")
            sqlQueries({
                choice: choice.selection,
                title: response.title,
                salary: parseInt(response.salary),
                departmentId: response.departmentId
            });

            init().then(getDept);
        });

    } else if (choice.selection === "Add Employees") {

    } else if (choice.selection === "View Departments") {
        console.table(deptArray);
        init().then(getDept);
    } else if (choice.selection === "View Roles") {

    } else if (choice.selection === "View Employees") {

    } else if (choice.selection === "Update Employee Roles") {

    } else {
        console.log("Thank You for using the app!")
        connection.end();
    }
};
init().then(getDept);





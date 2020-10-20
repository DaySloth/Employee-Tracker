const connection = require("./scripts/dbConnection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const sqlQueries = require("./scripts/sqlQueries");
const util = require("util");

let deptArray = [];
let deptNameArray = [];
let roleArray = [];
let roleNameArray = [];
let managerArray = [];

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
        connection.query("SELECT * FROM role", function (error, response) {
            roleArray = [];
    
            roleNameArray = response.map(element => element.title);
            response.forEach(element => {
                roleArray.push({
                    id: element.id,
                    title: element.title,
                    salary: element.salary,
                    department_id: element.department_id
                })
            });
            connection.query("SELECT first_name, last_name FROM employee AS a INNER JOIN role AS b ON a.role_id = b.id ", function(error, response){
                managerNameArray = ['None'];

                response.forEach(element => {
                    managerNameArray.push(`${element.first_name} ${element.last_name}`);
                });
                
                connection.query("SELECT * FROM employee", function(error, response){
                    managerArray = [];
    
                    response.forEach(element => {
                        managerArray.push(element);
                    });
                    handleChoices(initRes);
                })
            })
        });

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
            sqlQueries({
                choice: choice.selection,
                title: response.title,
                salary: parseInt(response.salary),
                departmentId: response.departmentId
            });

            init().then(getDept);
        });

    } else if (choice.selection === "Add Employees") {
        inquirer.prompt([
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
                choices: roleNameArray
            },
            {
                type: "list",
                name: "manager",
                message: "Who is their Manager?",
                choices: managerNameArray
            }
        ]).then(function(response){
            console.log(response);
            roleArray.forEach(element=>{
                if(element.title === response.role){
                    response.role_id = element.id;
                }
                console.log(managerArray)
            });
            if(response.manager === 'None'){
                sqlQueries({
                    choice: choice.selection,
                    first_name: response.first_name,
                    last_name: response.last_name,
                    role_id: response.role_id
                });
            }else{
                sqlQueries({
                    choice: choice.selection,
                    first_name: response.first_name,
                    last_name: response.last_name,
                    role_id: response.role_id,
                    manager_id: response.manager_id
                });
            }
        });
    } else if (choice.selection === "View Departments") {
        console.table(deptArray);
        init().then(getDept);
    } else if (choice.selection === "View Roles") {
        console.table(roleArray);
        init().then(getDept);
    } else if (choice.selection === "View Employees") {

    } else if (choice.selection === "Update Employee Roles") {

    } else {
        console.log("Thank You for using the app!")
        connection.end();
    }
};
init().then(getDept);





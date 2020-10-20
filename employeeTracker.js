const connection = require("./scripts/dbConnection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const sqlQueries = require("./scripts/sqlQueries");
const util = require("util");
const { up } = require("inquirer/lib/utils/readline");

let deptArray = [];
let deptNameArray = [];
let roleArray = [];
let roleNameArray = [];
let employeeArray = [];
let employeeNameArray = [];

function getData(initRes) {
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
                employeeNameArray = ['None'];

                response.forEach(element => {
                    employeeNameArray.push(`${element.first_name} ${element.last_name}`);
                });
                
                connection.query("SELECT * FROM employee", function(error, response){
                    employeeArray = [];
    
                    response.forEach(element => {
                        employeeArray.push(element);
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
            choices: ["Add Departments", "Add Roles", "Add Employees", "View Departments", "View Roles", "View Employees", "Update Employee Roles", "Update Employee Managers", "EXIT"]
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
            init().then(getData);
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

            init().then(getData);
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
                choices: employeeNameArray
            }
        ]).then(function(response){
            roleArray.forEach(element=>{
                if(element.title === response.role){
                    response.role_id = element.id;
                }
            });

            employeeArray.forEach(element=>{
                let name = `${element.first_name} ${element.last_name}`
                if(name === response.manager){
                    response.manager_id = element.id;
                }
            });
            
            sqlQueries({
                choice: choice.selection,
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: response.role_id,
                manager_id: response.manager_id
            });

            init().then(getData);
        });
    } else if (choice.selection === "View Departments") {
        console.table(deptArray);
        init().then(getData);
    } else if (choice.selection === "View Roles") {
        console.table(roleArray);
        init().then(getData);
    } else if (choice.selection === "View Employees") {
        connection.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, e.manager_id
        FROM employee AS e
        INNER JOIN role AS r ON e.role_id = r.id
        INNER JOIN department AS d ON r.department_id = d.id;
        `, function(err, res){
            //console.log(res);
            let displayObj = []
            res.forEach(element=>{
                let employeeObj = {
                    id: element.id,
                    first_name: element.first_name,
                    last_name: element.last_name,
                    title: element.title,
                    department: element.name,
                    salary: element.salary,
                    manager: element.manager_id
                }

                employeeArray.forEach(data=>{
                    if(parseInt(employeeObj.manager) === parseInt(data.id)){
                        employeeObj.manager = `${data.first_name} ${data.last_name}`
                    }
                })
                displayObj.push(employeeObj);
            })

            console.table(displayObj);
            init().then(getData);
        })

    } else if (choice.selection === "Update Employee Roles") {
        inquirer.prompt([
            {
                type: "list",
                message: "Who would you like to update roles for?",
                name: "employee",
                choices: employeeNameArray
            }
        ]).then(function(response){
            if(response.employee === "None"){
                init().then(getData);
            }else{
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What would you like their new role to be?",
                        name: "newRole",
                        choices: roleNameArray
                    }
                ]).then(function(res){
                    const splitName = response.employee.split(" ");
                    const updateObj = {
                        choice: choice.selection
                    };

                    employeeArray.forEach(element=>{
                        if(element.first_name === splitName[0] && element.last_name === splitName[1]){
                            updateObj.id = element.id
                        }
                    })

                    roleArray.forEach(element=>{
                        if(element.title === res.newRole){
                            updateObj.role_id = element.id;
                        }
                    });
                    sqlQueries(updateObj);
                    init().then(getData);                  
                })
            }
        })
    } else if(choice.selection === "Update Employee Managers"){
        inquirer.prompt([
            {
                type: "list",
                message: "Who would you like to update the manager for?",
                name: "employee",
                choices: employeeNameArray
            },
            {
                type: "list",
                message: "Who would you like their new manager to be?",
                name: "newManager",
                choices: employeeNameArray
            }
        ]).then(function(response){
            const employeeSplit = response.employee.split(" ");
            const managerSplit = response.newManager.split(" ");
            const updateObj = {
                choice: choice.selection,
            }
            employeeArray.forEach(element=>{
                if(element.first_name === employeeSplit[0] && element.last_name === employeeSplit[1]){
                    updateObj.id = element.id
                }
                if(element.first_name === managerSplit[0] && element.last_name === managerSplit[1]){
                    updateObj.manager_id = element.id
                }
            });

            sqlQueries(updateObj);
            init().then(getData);
        })
    }else {
        console.log("Thank You for using the app!")
        connection.end();
    }
};
init().then(getData);





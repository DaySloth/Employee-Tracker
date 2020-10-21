const connection = require("./scripts/dbConnection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const userPrompts = require("./scripts/userPrompts");
const sqlQueries = require("./scripts/sqlQueries");
const Font = require("ascii-art-font");

let deptArray = [];
let deptNameArray = [];
let roleArray = [];
let roleNameArray = [];
let employeeArray = [];
let employeeNameArray = [];

function getData(initRes) {
    connection.query("SELECT * FROM department", function (error, response) {
        if(error){throw error};
        deptArray = [];

        deptNameArray = response.map(element => element.name);
        response.forEach(element => {
            deptArray.push({
                id: element.id,
                name: element.name
            })
        });
        connection.query("SELECT * FROM role", function (error, response) {
            if(error){throw error};
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
                if(error){throw error};
                employeeNameArray = ['None'];

                response.forEach(element => {
                    employeeNameArray.push(`${element.first_name} ${element.last_name}`);
                });
                
                connection.query("SELECT * FROM employee", function(error, response){
                    if(error){throw error};
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
            choices: ["Add Departments", "Add Roles", "Add Employees", "View Departments", "View Roles", "View Employees", "View Employees by Manager", "Update Employee Roles", "Update Employee Managers", "EXIT"]
        }
    ]);
};

function handleChoices(choice) {
    if (choice.selection === "Add Departments") {
        userPrompts(choice.selection).then(function(response) {
            console.log("=".repeat(70));
            console.log(`Adding Department: '${response.deptName}' to database`);
            console.log("=".repeat(70));
            sqlQueries({ choice: choice.selection, deptName: response.deptName });
            init().then(getData);
        });
    } else if (choice.selection === "Add Roles") {
        userPrompts(choice.selection, deptNameArray).then(function(response) {
            deptArray.forEach(element => {
                if (element.name === response.dept) {
                    response.departmentId = element.id
                }
            });
            console.log("=".repeat(70));
            console.log(`Adding Role: '${response.title}' to database`);
            console.log("=".repeat(70));
            sqlQueries({
                choice: choice.selection,
                title: response.title,
                salary: parseInt(response.salary),
                departmentId: response.departmentId
            });

            init().then(getData);
        });

    } else if (choice.selection === "Add Employees") {
        userPrompts(choice.selection, roleNameArray, employeeNameArray).then(function(response){
            roleArray.forEach(element=>{
                if(element.title === response.role){
                    response.role_id = element.id;
                }
            });
            let name;
            employeeArray.forEach(element=>{
                name = `${element.first_name} ${element.last_name}`;
                if(name === response.manager){
                    response.manager_id = element.id;
                }
            });
            console.log("=".repeat(70));
            console.log(`Adding Employee: ${response.first_name} ${response.last_name} to database`);
            console.log("=".repeat(70));
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
        console.log("=".repeat(105));
        console.table(deptArray);
        console.log("=".repeat(105));
        init().then(getData);
    } else if (choice.selection === "View Roles") {
        console.log("=".repeat(105));
        console.table(roleArray);
        console.log("=".repeat(105));
        init().then(getData);
    } else if (choice.selection === "View Employees") {
        connection.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, e.manager_id
        FROM employee AS e
        INNER JOIN role AS r ON e.role_id = r.id
        INNER JOIN department AS d ON r.department_id = d.id;
        `, function(err, res){
            if(err){throw err};
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
            console.log("=".repeat(105));
            console.table(displayObj);
            console.log("=".repeat(105));
            init().then(getData);
        })

    } else if (choice.selection === "View Employees by Manager"){
        connection.query("SELECT id, first_name, last_name, manager_id from employee", function(err, res){
            let employeesWithManagerID = [];
            let managerList = [];
            let managerNameList = ['No manager listed',];
            let name;
            let displayEmployeeArray =[];
            res.forEach(element => {
                if(element.manager_id){
                    employeesWithManagerID.push(element);
                }
            });
            employeesWithManagerID.forEach(employee =>{
                res.forEach(element=>{
                    if(employee.manager_id === element.id){
                        name = `${element.first_name} ${element.last_name}`;
                        if(managerNameList.includes(name)){}
                        else{
                            managerList.push(element);
                            managerNameList.push(name);
                        };
                    };
                });
            });
            userPrompts(choice.selection, managerNameList).then(function(userResult){
                if(userResult.managerName === 'No manager listed'){
                    res.forEach(employee=>{
                        if(employee.manager_id){}
                        else{
                            displayEmployeeArray.push({ name: `${employee.first_name} ${employee.last_name}`})
                        }
                    });

                    console.log("=".repeat(70));
                    console.log("Displaying employees with no manager");
                    console.log("=".repeat(50));
                    console.table(displayEmployeeArray);
                    console.log("=".repeat(70));

                    init().then(getData);
                }else{
                    const managerSplit = userResult.managerName.split(" ");
                    managerList.forEach(element=>{
                        if(element.first_name === managerSplit[0] && element.last_name === managerSplit[1]){
                            res.forEach(employee=>{
                                if(employee.manager_id === element.id){
                                    displayEmployeeArray.push({
                                        employee: `${employee.first_name} ${employee.last_name}`
                                    })
                                }
                            });
                        };
                    });

                    console.log("=".repeat(70));
                    console.log("Displaying employees under "+ userResult.managerName);
                    console.log("=".repeat(50));
                    console.table(displayEmployeeArray);
                    console.log("=".repeat(70));

                    init().then(getData);
                }
                
            });
        })
    } else if (choice.selection === "Update Employee Roles") {
        userPrompts(choice.selection, employeeNameArray).then(function(response){
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

                    console.log("=".repeat(70));
                    console.log(`Updating ${response.employee}'s Role to ${res.newRole}`);
                    console.log("=".repeat(70));
                    sqlQueries(updateObj);
                    init().then(getData);                  
                })
            }
        })
    } else if(choice.selection === "Update Employee Managers"){
        userPrompts(choice.selection, employeeNameArray).then(function(response){
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
            console.log("=".repeat(70));
            console.log(`Updating ${response.employee}'s manager to ${response.newManager}`);
            console.log("=".repeat(70));
            sqlQueries(updateObj);
            init().then(getData);
        })
    }else {
        Font.create("Bye bye", 'Doom').then(function(graphic){
            console.log("=".repeat(45));
            console.log(graphic);
            console.log("=".repeat(45));
            connection.end();
        });
        
    }
};

Font.create("Employee Manager", 'Doom').then(function(graphic){
    console.log("=".repeat(105));
    console.log(graphic);
    console.log("=".repeat(105));
    init().then(getData);
});
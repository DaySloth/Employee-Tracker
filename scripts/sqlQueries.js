const connection = require("./dbConnection");

function sqlQueries(option) {

    if (option.choice === "Add Departments") {
        connection.query("INSERT INTO department SET ?",
            [{
                name: option.deptName
            }], function (error, response) {
                if (error) { throw error };
            }
        );
    } else if (option.choice === "Add Roles") {
        connection.query("INSERT INTO role SET ?",
            [{
                title: option.title,
                salary: option.salary,
                department_id: option.departmentId
            }],
            function (error, response) {
                if (error) { throw error };
            }
        );
    } else if (option.choice === "Add Employees") {

    } else if (option.choice === "View Departments") {

    } else if (option.choice === "View Roles") {

    } else if (option.choice === "View Employees") {

    } else if (option.choice === "Update Employee Roles") {

    } else {
        console.log("Error, Exiting");
        connection.end();
    }
}

module.exports = sqlQueries;
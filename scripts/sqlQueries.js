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
        connection.query("INSERT INTO employee SET ?",
            [{
                first_name: option.first_name,
                last_name: option.last_name,
                role_id: option.role_id,
                manager_id: option.manager_id
            }],
            function (error, response) {
                if (error) { throw error };
            }
        );

    } else if (option.choice === "Update Employee Roles") {
        connection.query("UPDATE employee SET ? WHERE ?",
            [{
                role_id: option.role_id
            },
            {
                id: option.id
            }],
            function (error, response) {
                if (error) { throw error };
            }
        );
    } else if (option.choice === "Update Employee Managers") {
        connection.query("UPDATE employee SET ? WHERE ?",
            [{
                manager_id: option.manager_id
            },
            {
                id: option.id
            }],
            function (error, response) {
                if (error) { throw error };
            }
        );

    } else if (option.choice === "Delete Departments") {
        connection.query("DELETE FROM department WHERE id=?",[option.deptId], function(error, response){
            if(error){throw error};
        });

    } else {
        console.log("Error, Exiting");
        connection.end();
    }
}

module.exports = sqlQueries;
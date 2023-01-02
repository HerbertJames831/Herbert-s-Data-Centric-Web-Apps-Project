var pMySQL = require('promise-mysql');
var pool = pMySQL.createPool({
    //The maximum number of connections that will be created at once
    connectionLimit: 10,
    //The host name of the database(proj2022) that is being connected to
    host: 'localhost',
    //The name the MySQL user is authenticating as
    user: 'root',
    //The password for the MySQL user
    password: 'Herbo123',
    //The proj2022 is the name of the database that will be utilized for this connection
    database: 'proj2022'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("pool error:" + e)
    })
const findEmployee = (id) => {
    console.log("Employee ID", id)
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM employee WHERE eid='${id}';`;
        pool.query(sql)
            .then((employee) => {
                resolve(employee)
            })
            .catch(error => {
                reject(error)
            })
    });
}
const updateEmployee = (id, { ename, role, salary }) => {
    console.log("Employee ID", id, ename, role, salary)
    return new Promise((resolve, reject) => {
        var sql = `UPDATE employee SET ename='${ename}', role='${role}', salary='${salary}' WHERE eid='${id}';`;
        pool.query(sql)
            .then((employee) => {
                resolve(employee)
            })
            .catch(error => {
                reject(error)
            })
    });
}
const getEmployees = () => {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM employee ORDER BY eid ASC;';
        pool.query(sql)
            .then((employee) => {
                resolve(employee)
            })
            .catch(error => {
                reject(error)
            });
    });
}
const getDepartments = () => {
    return new Promise((resolve, reject) => {
        var sql = 'SELECT * FROM dept ORDER BY did ASC;';
        pool.query(sql)
            .then((department) => {
                resolve(department)
            })
            .catch(error => {
                reject(error)
            });
    });
}
const deleteDepartment = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM dept  WHERE EXISTS (SELECT total FROM ( SELECT COUNT(eid) as total FROM dept LEFT JOIN emp_dept USING(did) GROUP BY did HAVING total=0)t) AND did="${id}";
        `;
        pool.query(sql)
            .then((result) => {
                resolve(result)
            })
            .catch(error => {
                reject(error)
            })
    });
}
const addEmployee = (id) => {
    return new Promise((resolve, reject) => {
        var sql = `INSERT INTO employee(eid) SELECT * FROM (SELECT E027 as eid) AS new_value
            WHERE NOT EXISTS(SELECT eid FROM employee WHERE eid > 'E026') LIMIT 1;
            `;
        pool.query(sql)
            .then((employee) => {
                resolve(employee)
            })
            .catch(error => {
                reject(error)
            })
    });
}
module.exports = { getEmployees, findEmployee, updateEmployee, getDepartments, deleteDepartment, addEmployee }

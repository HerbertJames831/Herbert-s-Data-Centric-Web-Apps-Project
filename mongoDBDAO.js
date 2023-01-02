const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
        db = client.db('employeesDB')
        coll = db.collection('employees')
    })
    .catch((error) => {
        console.log(error.message)
    })
var findAllEmployees = function () {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((employee) => {
                resolve(employee)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
var addEmployee = function (employee) {
    return new Promise((resolve, reject) => {
        coll.insertOne(employee)
            .then((employee) => {
                resolve(employee)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
module.exports = { findAllEmployees, addEmployee }
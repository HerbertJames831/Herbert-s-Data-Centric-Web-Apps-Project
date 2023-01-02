var express = require('express')
var app = express();
let ejs = require('ejs');
const path = require('path')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const { check, validationResult, body } = require('express-validator');
var mySQLDAO = require('./mySQLDAO')
var mongoDB_DAO = require('./mongoDBDAO')
/**
 * req stands for Request
 * A client makes a HTTP request to a named host which is located on a server 
 * The benefit of a HTTP request is a resource can be accessed on the server
 * When making a HTTP request, the URL(Uniform Resource Locator) components are utilized by the client, this includes the information required to access the resource. 
 * 
 * res stands for Response 
 * HTTP responses are made by a server to a client 
 * The objective of the HTTP response is the client is provided with the resource it requested
 * Another objective of the HTTP response is it notifies the client that the action it requested has been executed
 * The third objective of the HTTP response is it lets the client know that an error arises in processing its request 
 */
//The app.get() function allows a route handler for GET requests to the URL() be defined    
app.get('/', function (req, res) {
    //Informing the user that a GET request has been received on the Home Page(/)
    console.log("A GET request has been received on / ")
    //The res.sendFile() method is beneficial for transferring the file at the given path
    res.sendFile(path.join(__dirname, 'index.html'));
})
//The app.get() function allows a route handler for GET requests to the URL(/employees) be defined    
app.get('/employees', (req, res) => {
    //Informing the user that a GET request has been received on the Employee Page
    console.log("A GET request has been received on /employees ")
    //Querying the database using the mySQLDAO to find all employees information to display on the table
    //DAO is also known as Data Access Object
    //A Data Access Object is a universal interface to a collection of objects
    //The Data Access Object segregates a data resource's client interface from its data access mechanisms
    mySQLDAO.getEmployees()
        .then((employee) => {
            //The data is being displayed using the employees.ejs file
            //The res.render() function is imperative because it renders a view and the rendered HTML string is sent to the client  
            res.render('employees', { emps: employee })
        })
        .catch((error) => {
            //The error is being handled
        })
})
//The app.get() function allows a route handler for GET requests to the URL() be defined    
app.get('/employees/edit/:eid', (req, res) => {
    //Informing the user that a GET request has been received on the Edit Employee Page
    console.log("A GET request has been received on /employees/edit/:eid ")
    const eid = req.params.eid;
    //Querying the database using the mySQLDAO to display an employee's information in the form
    mySQLDAO.findEmployee(eid)
        .then((emp) => {
            let employee = emp[0];
            //The data is being displayed using the editEmployee.ejs file
            //The res.render() function is significant because it renders a view and the rendered HTML string is sent to the client  
            res.render('editEmployee', { employee, errors: undefined })
        })
        .catch((error) => {
            //The error is being handled
        })
})
app.get("/depts/delete/OPS", (req, res) => {
    res.render('opsError');
})
app.get('/depts/delete/:did', (req, res) => {
    console.log(req.params.did);
    mySQLDAO.deleteDepartment(req.params.did)
        .then((result) => {

            if (result.affectedRows == 0) {
                res.redirect('/depts/delete/OPS');
            } else {
                res.redirect('/depts');
            }
        })
        .catch((error) => { })
})
//Declaring and Initializing MySQL Validators
const updatemySQLValidators = [
    body('ename').isLength({ min: 5 }).withMessage('Name must be of at least 5 characters!'),
    body('role').isIn(['Manager', 'Employee']).withMessage("Invalid role!"),
    body('salary').isNumeric({ gt: 0 }).withMessage("Salary should be a positive number!")
]
//Declaring and Initializing MongoDB Validators
const updateMongoDBValidators = [
    body('_id').isLength({ min: 4 }).withMessage('ID must be of at least 4 characters!'),
    body('phone').isLength({ min: 5 }).withMessage("Phone must be greater than 5 characters!"),
    body('email').isEmail({ max: 5 }).withMessage("Please enter a valid email address!")
]
//The app.post() function is important for HTTP POST requests being routed to the specified path with the specified callback functions 
app.post('/employees/edit/:eid', updatemySQLValidators, (req, res) => {
    //Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const employeeUpdated = {
        ename: req.body.ename,
        role: req.body.role,
        salary: req.body.salary,
    }
    //Once the employee has been successfully updated in the mySQL database, the user is returned to the Employees Page(/employees)
    mySQLDAO.updateEmployee(req.body.eid, employeeUpdated)
        .then((emp) => {
            res.redirect('/employees');
        })
        .catch((error) => {
            //The error is being handled
        })
})
//The app.get() function allows a route handler for GET requests to the URL(/depts) be defined    
app.get('/depts', (req, res) => {
    //Querying the database using the mySQLDAO to find all information about departments to place on the table
    mySQLDAO.getDepartments()
        .then((department) => {
            //The data is being displayed using the departments.ejs file
            //The res.render() function helps to render a view and ensures the rendered HTML string is sent to the client  
            res.render('departments', { depts: department })
        })
        .catch((error) => {
            res.render('deleteDepartment', { errors: undefined })
            //The error is being handled
        })
})
//The app.get() function allows a route handler for GET requests to the URL(/employeesMongoDB) be defined 
app.get('/employeesMongoDB', (req, res) => {
    mongoDB_DAO.findAllEmployees()
        .then((employee) => {
            //Processing documents
            //The data is being displayed using the employees(MongoDB).ejs file
            //The res.render() function helps to render a view and ensures the rendered HTML string is sent to the client  
            res.render('employees(MongoDB)', { emps: employee })
        })
        .catch((error) => { })
})
//The app.get() function allows a route handler for GET requests to the URL(/employeesMongoDB/add) be defined 
app.get('/employeesMongoDB/add', (req, res) => {
    res.render('addEmployee(MongoDB)', { errors: undefined });
})
//Hey Gerard just to let you know when you are running this, please make sure you have one of the app.post('/employeesMongoDB/add') for MySQL and Mongo commented out while doing so just in case it leads to compilation errors
//Displaying an error message if the user enters a EID that is already in the Mongo database
//The app.post() function is important for HTTP POST requests being routed to the specified path with the specified callback functions 
//     app.post('/employeesMongoDB/add', updateMongoDBValidators, (req, res)=>{
//         const errors= validationResult(req);
//         if(!errors.isEmpty()){
//          return res.status(400).json({errors: errors.array()})
//         }
//         const employeeAdded = {
//             _id:req.body._id,
//             phone:req.body.phone,
//              email:req.body.email,
//         }
//     mongoDB_DAO.addEmployee(employeeAdded)
// .then((emp)=> {
//     res.redirect('/employeesMongoDB');
// })
// .catch((error)=> {
// //The error is being handled
// if(error.message.includes("E11000")){
//     res.render('alreadyExists',{ employee:employeeAdded});
// }else{
// res.send(error.message)
// }
// })
//
//Displaying an error message in the mySQL database, if the user enters an EID that is not in the mySQL Database 
app.post('/employeesMongoDB/add', updateMongoDBValidators, (req, res) => {
    const employeeAdded = {
        eid: req.body.eid,
        phone: req.body.phone,
        email: req.body.email,
    }
    mySQLDAO.addEmployee(employeeAdded)
        .then((employee) => {
        })
        .catch((error) => {
            //The error is being handled
            if (error.message.includes("E11000")) {
                res.render('mySQLdoesnotExists', { employee: employeeAdded });
            } else {
                res.send(error.message)
            }
        })
})
//The app.get() function allows a route handler for GET requests to the URL(/hebbyjayInnovation) be defined    
app.get('/hebbyjayInnovation', function (req, res) {
    //Informing the user that a GET request has been received on the Hebby Jay Innovation Page(/)
    console.log("A GET request has been received on /hebbyjayInnovation ")
    //The res.sendFile() method is beneficial for transferring the file at the given path
    res.sendFile(path.join(__dirname, 'hebbyJayInnovation.html'));

})
//The app.listen() function is utilized to bind and listen the connections on the specified host and port
//5000 is the port
app.listen(5000, () => {
    console.log("Server is listening")
})
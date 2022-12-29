const { Router } = require('express');
const accountController = require('./controllers/accountController');
const routes = Router();
const taskController = require('./controllers/taskController');

routes.get('/tasks', accountController.authenticateToken, taskController.getTasks);
routes.get('/monthTask/:year/:month', accountController.authenticateToken, taskController.getMonthTasks);
routes.post('/addTask', accountController.authenticateToken, taskController.addTask);
routes.post('/grantTask', accountController.authenticateToken, taskController.grantTask);

routes.post('/register', accountController.register);
routes.post('/login', accountController.login);
module.exports = routes;
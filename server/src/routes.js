const { Router } = require('express');
const accountController = require('./controllers/accountController');
const routes = Router();
const taskController = require('./controllers/taskController');

routes.get('/tasks', accountController.authenticateToken, taskController.getTasks);
routes.post('/addTask', accountController.authenticateToken, taskController.addTask);

routes.post('/register', accountController.register);
routes.post('/login', accountController.login);
module.exports = routes;
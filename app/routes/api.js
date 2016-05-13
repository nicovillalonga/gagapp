'use strict';

var List = require('../models/list'),
	Dashboard = require('../models/dashboard'),
	Task = require('../models/task'),
	apiUsers = require('./apiRoutes/apiUsers'),
	apiDashboards = require('./apiRoutes/apiDashboard'),
	apiTasks = require('./apiRoutes/apiTasks'),
	apiAuth = require('./apiRoutes/apiAuth'),
	apiMail = require('./apiRoutes/apiMail');

module.exports = function(app, express) {

	var apiRouter = express.Router();
	
	// route middleware to verify a token excepting register
	apiRouter.post('/authenticate', apiAuth.postAuth);
	apiRouter.use('/', apiAuth.verifyToken);
	
	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	//Mail route
	apiRouter.post('/sendRegister/:email/:username', apiMail.sendRegister);
	app.get('/verify', apiMail.verifyRegister);

	//Users routes
	apiRouter.route('/users')
		.post(apiUsers.postUsers)
		.get(apiUsers.getUsers);
	apiRouter.route('/users/:user_id')
		.get(apiUsers.getUserId)
		.put(apiUsers.putUserId)
		.delete(apiUsers.deleteUserId);
	apiRouter.get('/userName/:username', apiUsers.getUserName);

	//Dashboards routes
	apiRouter.post('/dashboards', apiDashboards.postDashboard);
	apiRouter.get('/dashboards/:owner', apiDashboards.getDashboardOwner);
	apiRouter.route('/dashboard/:_id')
		.get(apiDashboards.getDashboardId)
		.delete(apiDashboards.deleteDashboardId);

	//Tasks routes
	apiRouter.post('/task', apiTasks.postTask);
	apiRouter.delete('/task/:_id', apiTasks.deleteTask);
		
	return apiRouter;
};

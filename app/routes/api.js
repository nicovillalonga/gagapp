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

	/**
	 * @api {post} /authenticate Authenticate User
	 * @apiName Authenticate
	 * @apiGroup Auth
	 *
	 * @apiSuccess {String} message Authenticate the user.	 
	 */	
	apiRouter.post('/authenticate', apiAuth.postAuth);

	/**
	 * @api {get} / Verify the token in localstorage
	 * @apiName VerifyToken
	 * @apiGroup Auth
	 *
	 * @apiSuccess {String} message Token provided.
	 */
	apiRouter.use('/', apiAuth.verifyToken);

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});

	/**
	 * @api {post} /sendRegister/:email/:username Send Register
	 * @apiName Send Register
	 * @apiGroup Mail
	 *
     * @apiParam {String} email email of the user.
     * @apiParam {String} username username if the user.
	 *
	 * @apiSuccess {String} message Authenticate the user.	 
	 */
	//Mail route
	apiRouter.post('/sendRegister/:email/:username', apiMail.sendRegister);

	/**
	 * @api {get} /verify Verify Register
	 * @apiName Verify
	 * @apiGroup Mail
	 *
     * @apiSuccess {String} message Email verified correct.	 
	 */
	//Mail route
	app.get('/verify', apiMail.verifyRegister);

	/**
	 * @api {post} /users Create User
	 * @apiName Create User
	 * @apiGroup Users
	 *
	 * @apiParam {String} email req.body.email
	 * @apiParam {String} username req.body.username
	 * @apiParam {String} password req.body.password
	 *
     * @apiSuccess {String} message User created!.. email: +  -- username:.	 
	 */
	/**
	 * @api {get} /users Get All Users
	 * @apiName Get All Users
	 * @apiGroup Users
	 *
     * @apiSuccess {Object[]} users List of user profiles.	 
	 */
	//Users routes
	apiRouter.route('/users')
		.post(apiUsers.postUsers)
		.get(apiUsers.getUsers);

	/**
	 * @api {get} /users/:user_id Get User by Id
	 * @apiName Get User by Id
	 * @apiGroup Users
	 *
	 * @apiParam {Number} user_id id of the user.
	 *
     * @apiSuccess {Object} user user.	 
	 */
	 /**
	 * @api {put} /users/:user_id Edit User
	 * @apiName Edit user
	 * @apiGroup Users
	 *
	 * @apiParam {Number} user_id id of the user.
	 * @apiParam {String} username req.body.username
	 * @apiParam {String} password req.body.password
	 *
     * @apiSuccess {String} message updated.	 
	 */
	 /**
	 * @api {delete} /users/:user_id Delete User by Id
	 * @apiName Delete User by Id
	 * @apiGroup Users
	 *
	 * @apiParam {Number} user_id id of the user.
	 *
     * @apiSuccess {String} message User successfully deleted.	 
	 */
	apiRouter.route('/users/:user_id')
		.get(apiUsers.getUserId)
		.put(apiUsers.putUserId)
		.delete(apiUsers.deleteUserId);

	/**
	 * @api {get} /userName/:username Get User by UserName
	 * @apiName Get User by UserName
	 * @apiGroup Users
	 *
	 * @apiParam {String} username username of the user.
	 *
     * @apiSuccess {Object} user user.	 
	 */
	apiRouter.get('/userName/:username', apiUsers.getUserName);

	/**
	 * @api {post} /dashboards Create a Dashboard
	 * @apiName Create a Dashboard
	 * @apiGroup Dashboard
	 *	 
	 * @apiParam {String} dashboard.text req.body.text
	 * @apiParam {String} dashboard.owner req.body.getDashboardOwner
	 *
	 * @apiSuccess {String} message Dashboard created.	 
	 */
	//Dashboards routes
	apiRouter.post('/dashboards', apiDashboards.postDashboard);

	/**
	 * @api {get} /dashboards/:owner Get All Dashboards by Owner
	 * @apiName Get all dashboards by owner
	 * @apiGroup Dashboard
	 *
	 * @apiParam {String} owner owner of the dashboard.
	 *
	 * @apiSuccess {Object[]} dashboards List of dashboards of this owner.	 
	 */
	apiRouter.get('/dashboards/:owner', apiDashboards.getDashboardOwner);

	/**
	 * @api {get} /dashboards/:_id Get Dashboard by Id
	 * @apiName Get dashboard by id
	 * @apiGroup Dashboard
	 *
	 * @apiParam {String} _id _id of the dashboard selected.
	 *
	 * @apiSuccess {Object} dashboard dashboard selected.	 
	 */
	 /**
	 * @api {delete} /dashboards/:_id Delete Dashboard by Id
	 * @apiName Delete dashboard by id
	 * @apiGroup Dashboard
	 *
	 * @apiParam {String} _id _id of the dashboard selected.
	 *
	 * @apiSuccess {String} message Dashboard Successfully deleted.	 
	 */
	apiRouter.route('/dashboard/:_id')
		.get(apiDashboards.getDashboardId)
		.delete(apiDashboards.deleteDashboardId);

    /**
	 * @api {put} /updateTaskIndexes Update Task Indexes
	 * @apiName Update Task Indexes
	 * @apiGroup Dashboard
	 *
	 * @apiSuccess {String} message Indexes updated.	 
	 */
	apiRouter.put('/updateTaskIndexes/', apiDashboards.updateTaskIndexes);

	/**
	 * @api {post} /task Create Task
	 * @apiName Create Task
	 * @apiGroup Tasks
	 *	 
	 * @apiParam {Number} task.index  req.body.index
	 * @apiParam {Number} task.sprint  req.body.sprint
	 * @apiParam {Number} task.storyPoints req.body.storyPoints
	 * @apiParam {Number} task.priority req.body.priority
	 * @apiParam {String} task.name req.body.name
	 * @apiParam {String} task.description req.body.description
	 * @apiParam {String} task.asignedTo req.body.asignedTo
	 *
	 * @apiSuccess {String} message Task created!.. name.
	 */
	//Tasks routes
	apiRouter.post('/task', apiTasks.postTask);

	/**
	 * @api {delete} /task/:_id Delete Task by Id
	 * @apiName Delete task
	 * @apiGroup Tasks
	 *
	 * @apiParam {String} _id _id of the task to delete.
	 *
	 * @apiSuccess {String} message Task Successfully deleted.
	 */
	apiRouter.delete('/task/:_id', apiTasks.deleteTask);

	return apiRouter;
};

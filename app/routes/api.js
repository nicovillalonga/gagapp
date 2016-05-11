'use strict';

var List = require('../models/list'),
	Dashboard = require('../models/dashboard'),
	Task = require('../models/task'),
	apiUsers = require('./apiRoutes/apiUsers'),
	apiDashboards = require('./apiRoutes/apiDashboard'),
	apiAuth = require('./apiRoutes/apiAuth'),
	apiMail = require('./apiRoutes/apiMail');

module.exports = function(app, express) {

	var apiRouter = express.Router();
	
	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});
	// route middleware to verify a token excepting register
	apiRouter.use('/', apiAuth.verifyToken);
	apiRouter.post('/authenticate', apiAuth.postAuth);

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
	apiRouter.route('/task')
		.post(function(req, res) {
			// create a new instance of the Task model
			var dashId = req.body.dashId;
			var list;
			var task = new Task();
			
			// set the task information (comes from the request)
	  		task.index = req.body.index;
	  		task.sprint = req.body.sprint;
			task.storyPoints = req.body.storyPoints;
			task.priority = req.body.priority;
			task.name = req.body.name;
			task.description = req.body.description;
			task.asignedTo = req.body.asignedTo;

			//var dashboardModel = new Dashboard();

			/*Dashboard.findByIdAndUpdate(
			    dashId,
			    {$push: {lists: task}},
			    {safe: true, upsert: true},
			    function(err, data) {
			        if (err) return res.send(err);
					res.json({ message: 'Task created!.. name: ' + task.name });
					console.log(data);
			    }
			);*/

			Dashboard.findById(dashId, function(err, dashboard) {
				if (err) return res.send(err);

				List.findOne({dashboardId: dashId, name: 'Backlog'}, function(err, list) {
					list.tasks.push(task);
					list.save(function(err, newList) {
						if (err) {
							return res.send(err);
						}
					});
					
					//dashboard.version += 1;
					
					/*dashboard.findOneAndUpdate({lists: {id: 0}}, {$push: {}}, {upsert:true}, function(err){
					    if (err) res.send(err);
						res.json({ message: 'Task created!.. name: ' + task.name });
					});*/
					
					//var subdoc = dashboard.lists[0].tasks[0];
					//dashboard.markModified('lists');				
					//dashboard.markModified('lists[0].tasks');				

					dashboard.save(function (err) {
						if (err) return res.send(err);
						res.json({ message: 'Task created!.. name: ' + task.name, type: 'task', obj: task });
					});
				});
			});

		});	



	apiRouter.route('/task/:_id')
		.delete(function(req, res) {
			Task.remove({ _id: req.params._id }, function(err, user) {
				if (err) return res.send(err);
				res.json({ message: 'Task ' + req.params._id + ' Successfully deleted' });
			});
		});
		
	return apiRouter;
};

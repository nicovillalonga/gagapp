"use strict";

var Dashboard = require('../../models/dashboard'),
	List = require('../../models/list'),
	Task = require('../../models/task');

module.exports = {
	postTask: function(req, res) {
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


		Dashboard.findById(dashId).exec()
		.then(function(dashboard) {
			return List.findOne({dashboardId: dashId, name: 'Backlog'}).exec();
		})
		.then(function(list) {
			list.tasks.push(task);
			return list.save();
		})
		.then(function() {
			res.json({ message: 'Task created!.. name: ' + task.name, type: 'task', obj: task });
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	deleteTask: function(req, res) {
		Task.remove({ _id: req.params._id }).exec()
		.then(function(err, user) {
			res.json({ message: 'Task ' + req.params._id + ' Successfully deleted' });
		})
		.catch(function(err) {
			res.send(err);
		});
	}
};

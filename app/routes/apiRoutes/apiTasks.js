"use strict";

var Dashboard = require('../../models/dashboard'),
	List = require('../../models/list'),
	Task = require('../../models/task'),
	Activity = require('../../models/activity');

function _setListIndexes(tasks, index) {
	var length = tasks.length;
	var start = index > 0 ? index-1 : 0;

	if(tasks.length > 0) {
		for (var i = start; i < length; i++) {
			tasks[i].index = i;
		}
	}
}

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

	updateSingleListIndex: function(req, res) {
		var newIndex = req.body.newIndex;
		var oldIndex = req.body.oldIndex;

		List.findById(req.body.originListId).exec()
		.then(function(list) {
			//move the selected element from its original position to new index position.
			list.tasks.splice(newIndex, 0, list.tasks.splice(oldIndex, 1)[0]);
			_setListIndexes(list.tasks, oldIndex);
			return list.save();
		})
		.then(function(list) {
			res.json({message: 'Index updated', list: list});
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	updateMultiListIndex: function(req, res) {
		var originList;
		var lists = [];
		var oldIndex = req.body.oldIndex,
			newIndex = req.body.newIndex;

		List.findById(req.body.originListId).exec()
		.then(function(list) {
			originList = list;
			return List.findById(req.body.targetListId).exec();
		})
		.then(function(targetList) {
			//remove element from original list and insert to target list
			targetList.tasks.splice(newIndex, 0, originList.tasks.splice(oldIndex, 1)[0]);
			//update the indexes of the target list
			_setListIndexes(targetList.tasks, newIndex);
			//update the indexes of the origin list
			_setListIndexes(originList.tasks, oldIndex);
			return targetList.save();
		})
		.then(function(targetList) {
			lists.push(targetList);
			return originList.save();
		})
		.then(function(originList) {
			lists.push(originList);
			res.json({message: 'Index updated', lists: lists});
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	deleteTask: function(req, res) {
		var dashId = req.params.dashId,
			taskId =req.params._id,
			listName = req.params.listName,
			dash;

			Dashboard.findById(dashId).exec()
			.then(function(dashboard) {
				dash = dashboard;
				return List.findOne({dashboardId: dashId, name: listName}).exec();
			})
			.then(function(listResponse) {
				var index = listResponse.tasks.filter(function(task) {
					return task._id.toString() === taskId;
				});

				if(index.length > 0) {
					index = index[0].index;
					listResponse.tasks.splice(index, 1);
					_setListIndexes(listResponse.tasks, index);
				}

				return listResponse.save();
			})
			.then(function() {
				return dash.save();
			})
			.then(function() {
				res.json({ message: 'Task ' + ' Successfully deleted' });
			})
			.catch(function(err) {
				res.send(err);
			});
	},

	saveActivity: function(req, res) {
		var activity = new Activity();
		var list;
		var task;

		activity.type = req.body.type;
		activity.text = req.body.text;
		activity.user = req.body.user;
		activity.date = req.body.date;

		console.log('*** req.body ***', req.body.text);
		console.log('*** activity ***', activity.text);

		List.findById(req.body.listId).exec()
		.then(function(resultList) {
			list = resultList;
			task = list.tasks.filter(function(task) {
				return task._id.toString() === req.body.taskId;
			})[0];

			task.activities.push(activity);
			console.log('*** task ***', task);
			console.log('task', list.tasks);

			return list.save();
		})
		.then(function() {
			console.log('exito', activity);
			res.json({ message: 'Activity saved', activity: activity });
		})
		.catch(function(err) {
			console.log('error', err);
			res.send(err);
		})



		/*
		List.findById(req.body.listId).exec()
		.then(function(list) {
			console.log('*** tasks ***', list.tasks);
			console.log('*** taskId ***', req.body.taskId);
			
			task = list.tasks.filter(function(task) {
				console.log('------------------------------');
				console.log(typeof task._id.toString());
				console.log(typeof req.body.taskId);
				console.log(task._id);
				console.log(req.body.taskId);
				console.log(task._id.toString() === req.body.taskId);
				console.log('------------------------------');
				return task._id.toString() === req.body.taskId;
			});
			console.log('*** task ***', task);
			task.activities.push(activity);
			console.log('*** task ***', task);

			return list.save();
		})
		.then(function(list) {
			console.log('*** exito ***', list);
			res.json({ message: 'Activity saved', activity: activity });
		})
		.catch(function(err) {
			console.log('*** error ***', err);
			res.send(err);
		});
		*/

	}
};

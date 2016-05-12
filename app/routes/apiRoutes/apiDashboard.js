'use strict';

var User = require('../../models/user'),
	List = require('../../models/list'),
	Dashboard = require('../../models/dashboard'),
	jwt = require('jsonwebtoken'),
	config = require('../../../config'),
	superSecret = config.secret;

function isListSaved(reqObj) {
	if(reqObj.length !== reqObj.dashboard.lists.length) {
		setTimeout(function () {
			isListSaved(reqObj);
		}, 150);
	} else {
		saveDashboard(reqObj);
	}
};

function saveDashboard(reqObj) {
	var dashboard = reqObj.dashboard;
	var req = reqObj.req;
	var res = reqObj.res;
	var errMsg = "A dashboard with that name already exists.";

	// set the dashboard information (comes from the request)
	dashboard.text = req.body.text;
	dashboard.owner = req.body.owner;
	dashboard.actualSprint = 1;

	
	// save the dashboard and check for errors
	dashboard.save()
	.catch(function(err) {
		errMsg = err.code === 11000 ? errMsg : err;
		res.json({ success: false, message: errMsg});
	});
};


module.exports = {
	postDashboard: function(req, res) {
		var dashboard = new Dashboard();
		var list,
			listNames = ['Backlog', 'Todo', 'Progress', 'Done'];
		var length = listNames.length;
		var reqObj = {
			"dashboard": dashboard,
			"req": req,
			"res": res,
			"length": length
		};

		listNames.forEach(function(el, i) {
			(function(i, length) {
				list = new List();
				list.dashboardId = dashboard._id;
				list.name = listNames[i];
				list.tasks = [];
				list.save()
				.then(function(newList) {
					dashboard.lists.push(newList._id);
				})
				.catch(function(err) {
					res.send(err);
				});

				((i === length - 1) && isListSaved(reqObj));
			})(i, length);
		});
	},

	getDashboardOwner: function(req, res) {
		Dashboard.find({ $or: [{owner: req.params.owner}, {participants: {username: req.params.owner}} ]}).exec()
		.then(function(dashboards) {
			res.json(dashboards);
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	getDashboardId: function(req, res) {
		Dashboard.findById(req.params._id).populate('lists').exec()
		.then(function(dashboard) {
			res.json(dashboard);
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	deleteDashboardId: function(req, res) {
		List.remove({dashboardId: req.params._id}).exec()
		.then(function() {
			return Dashboard.remove({ _id: req.params._id }).exec()
		})
		.then(function() {
			res.json({ message: 'Dashboard ' + req.params._id + ' Successfully deleted' });
		})
		.catch(function(err) {
			res.send(err);
		});
	}
}

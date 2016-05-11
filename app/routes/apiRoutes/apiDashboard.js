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

	// set the dashboard information (comes from the request)
	dashboard.text = req.body.text;
	dashboard.owner = req.body.owner;
	dashboard.actualSprint = 1;

	
	// save the dashboard and check for errors
	dashboard.save(function(err) {
		if (err) {
			// duplicate entry
			if (err.code === 11000)
				return res.json({ success: false, message: 'A dashboard with that name already exists. '});
			else
				return res.send(err);
		}
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
				list.save(function(err, newList) {
					if (err) {
						return res.send(err);
					}
					dashboard.lists.push(newList._id);
				});

				((i === length - 1) && isListSaved(reqObj));
			})(i, length);
		});
	},

	getDashboardOwner: function(req, res) {
		Dashboard.find({ $or: [{owner: req.params.owner}, {participants: {username: req.params.owner}} ]},
			function(err, dashboards) {
				if (err) return res.send(err);
				return res.json(dashboards);
		});
	},

	getDashboardId: function(req, res) {
		Dashboard.findById(req.params._id, function(err, dashboard) {
			if (err) return res.send(err);
			
			return res.json(dashboard);
		})
		.populate('lists');
	},

	deleteDashboardId: function(req, res) {
		List.remove({dashboardId: req.params._id}, function(err, lists) {
			if (err) return res.send(err);
			
			Dashboard.remove({ _id: req.params._id }, function(err, dash) {
				if (err) return res.send(err);
				res.json({ message: 'Dashboard ' + req.params._id + ' Successfully deleted' });
			});
		});

	}	
}

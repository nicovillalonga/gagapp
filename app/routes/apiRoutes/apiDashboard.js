"use strict";

var User = require('../../models/user'),
	List = require('../../models/list'),
	Dashboard = require('../../models/dashboard'),
	jwt = require('jsonwebtoken'),
	config = require('../../../config'),
	superSecret = config.secret;

function setDash(dash, values) {
	// set the dash information (comes from the request)	
	if(values.participants) {
		var allParticipants = dash.participants.concat(values.participants);
		dash.participants = allParticipants;	
	}	
}

function isListSaved(reqObj) {
	if(reqObj.length !== reqObj.dashboard.lists.length) {
		setTimeout(function () {
			isListSaved(reqObj);
		}, 150);
	} else {
		saveDashboard(reqObj);
	}
}

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
	.then(function(dash) {
		res.send(dash);
	})
	.catch(function(err) {
		errMsg = err.code === 11000 ? errMsg : err;
		res.json({ success: false, message: errMsg});
	});
}


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
				list.orderId = i;
				list.save()
				.then(function(newList) {
					dashboard.lists.push(newList._id);
					if(i === length-1) {
						isListSaved(reqObj);
					}
				})
				.catch(function(err) {
					res.send(err);
				});
			})(i, length);
		});
	},

	getDashboardOwner: function(req, res) {
		Dashboard.find({ $or: [{owner: req.params.owner}, {participants: { "$in": [req.params.owner]}} ]}).exec()
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
			return Dashboard.remove({ _id: req.params._id }).exec();
		})
		.then(function() {
			res.json({ message: 'Dashboard ' + req.params._id + ' Successfully deleted' });
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	addParticipants: function(req, res) {
		var dataToUpdate = {};		
		if(req.body.participants) dataToUpdate.participants = req.body.participants;	

		Dashboard.findById(req.params._id).exec()
		.then(function(dash) {
			setDash(dash, dataToUpdate);
			return dash.save();
		})
		.then(function() {
			res.json({ message: 'Dashboard updated!' });
		})
		.catch(function(err) {
			res.send(err);
		});
	}
};

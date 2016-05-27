'use strict';

var User = require('../../models/user');

function setUser(user, values) {
	// set the users information (comes from the request)
	if(values.email) user.email = values.email;
	if(values.username) user.username = values.username;
	if(values.password) user.password = values.password;
}

function processError(err) {
	var field = err.message.indexOf('username') !== -1 ? 'username' : 'email';
	var errMsg = err.code === 11000 ? field + " already in use." : err.message;
	return {success: false, message: errMsg};
}

module.exports = {
	postUsers: function(req, res) {
		// create a new instance of the User model
		var user = new User();
		var errMsg = "A user with that username already exists.";

		setUser(user, {email: req.body.email, username: req.body.username, password: req.body.password});
		// save the user and check for errors
		user.save()
		.then(function(user) {
			res.json({
				success: true,
				message: 'User created!.. email: ' + user.email + ' -- username: ' + user.username,
				user: user
			});
		})
		.catch(function(err) {
			res.json(processError(err));
		});
	},

	getUsers: function(req, res) {
		User.find().exec()
		.then(function(users) {
			res.json(users);
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	getUserId: function(req, res) {
		User.findById(req.params.user_id).exec()
		.then(function(user) {
			res.json(user);
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	putUserId: function(req, res) {
		var dataToUpdate = {};
		if(req.body.username) dataToUpdate.username = req.body.username;
		if(req.body.password) dataToUpdate.password = req.body.password;

		User.findById(req.params.user_id).exec()
		.then(function(user) {
			setUser(user, dataToUpdate);
			return user.save();
		})
		.then(function() {
			res.json({ message: 'User updated!' });
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	deleteUserId: function(req, res) {
		User.remove({ _id: req.params.user_id })
		.then(function(user) {
			res.json({ message: 'Users ' + user.data + ' successfully deleted' });
		})
		.catch(function(err) {
			res.send(err);
		});
	},

	getUserName: function(req, res) {
		User.find({username: req.params.username}).exec()
		.then(function(user) {
			res.json(user);
		})
		.catch(function(err) {
			res.send(err);
		});
	}
};

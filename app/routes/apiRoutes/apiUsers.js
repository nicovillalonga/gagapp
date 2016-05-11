'use strict';

var User = require('../../models/user');

function setUser(user, values) {
	// set the users information (comes from the request)
	user.email = values.email;
	user.username = values.username;
	user.password = values.password;
}

module.exports = {
	postUsers: function(req, res) {
		// create a new instance of the User model
		var user = new User();
		
		setUser(user, {email: req.body.email, username: req.body.username, password: req.body.password});
		// save the user and check for errors
		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code === 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else
					return res.send({success: false, err: err});
			}

			res.json({ message: 'User created!.. email: ' + user.email + ' -- username: ' + user.username});
		});
	},

	getUsers: function(req, res) {
		User.find(function(err, users) {
			if (err) return res.send(err);
			// return the users
			res.json(users);
		});
	},

	getUserId: function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) return res.send(err);
				// return that user
				res.json(user);
		});
	},

	putUserId: function(req, res) {
		// use our user model to find the user we want
		User.findById(req.params.user_id, function(err, user) {
			if (err) return res.send(err);
			
			setUser(user, {email: req.body.email, username: req.body.username, password: req.body.password});
			// save the user
			user.save(function(err) {
				if (err) return res.send(err);
				res.json({ message: 'User updated!' });
			});
		});
	},

	deleteUserId: function(req, res) {
		User.remove({ _id: req.params.user_id }, function(err, user) {
			if (err) return res.send(err);
			res.json({ message: 'Successfully deleted' });
		});
	},

	getUserName: function(req, res) {
		User.find({username: req.params.username}, function(err, user) {
			if (err) return res.send(err);
			res.json(user);
		});	
	}
}

'use strict';

var User = require('../../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../../config'),
	superSecret = config.secret;

module.exports = {
	postAuth: function(req, res) {
		console.log(req.body);
		// find the user
		// select the name username and password explicitly
		User.findOne({username: req.body.username}).select('email username password validated').exec(function(err, user) {
			if (err) throw err;
			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {
				//if user is mail validated then checks the password 
				if(user.validated){
					// check if password matches
					var validPassword = user.comparePassword(req.body.password);
					if (!validPassword) {
						res.json({
							success: false,
							message: 'Authentication failed. Wrong password.'
						});
					} else {
						// if user is found and password is right
						// create a token
						var token = jwt.sign(
											{
												email: user.email,
												username: user.username
											},
											superSecret,
											{
												expiresInMinutes: 1440 // expires in 24 hours
											});
						// return the information including token as JSON
						res.json({
							success: true,
							message: 'Enjoy your token!',
							token: token
						});
					}
				} else {
					//user has not yet validated email
					res.json({
							success: false,
							message: 'User has not yet been validated, please check your email'
					});
				}
			}
		});
	},

	verifyToken: function(req, res, next) {
		//var dontAuth = /((\/userName\/.+)|(\/users\/)|(\/sendRegister\/.+\/.+)|(\/verify\/.+))/;
		var dontAuth = /((\/userName\/.+)|(\/sendRegister\/.+\/.+)|(\/verify\/.+))/;

		console.log(req.method, ' - ',req.path + ' - ' + 'regex - ' + dontAuth.test(req.path));

		//if a url is contained in dontAuth then it should escape the authentication
		if(dontAuth.test(req.path) || (req.path === '/users/' && req.method === 'POST')) {
			next();
		} else {
			console.log('Somebody just came to our app!');
			// check header or url parameters or post parameters for token
			var token = req.body.token || req.param('token') || req.headers['x-access-token'];
			// decode token
			if (token) {
				// verifies secret and checks exp
				jwt.verify(token, superSecret, function(err, decoded) {
					if (err) {
						return res.status(403).send({
							success: false,
							message: 'Failed to authenticate token.'
						});
					} else {
						// if everything is good, save to request for use in other routes
						req.decoded = decoded;
						next();
					}
				});
			} else {
				// if there is no token
				// return an HTTP response of 403 (access forbidden) and an error message
				return res.status(403).send({
					success: false,
					message: 'No token provided.'
				});
			}
		}
	}
}

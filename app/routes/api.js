var User = require('../models/user'),
	List = require('../models/list'),
	Dashboard = require('../models/dashboard'),
	Task = require('../models/task'),
	jwt = require('jsonwebtoken'),    
	config = require('../../config'),
	//directTransport = require('nodemailer-direct-transport'),
	nodemailer = require("nodemailer"),
	rand,
	mailOptions,
	host,
	link,
	// super secret for creating tokens
	superSecret = config.secret,
    
    //i have a problem with nodemailer so i found this
    //http://stackoverflow.com/questions/24876036/error-connect-eaddrnotavail
	transporter = nodemailer.createTransport('SMTP',{
		service: 'Gmail',
	    auth: {
	        user: 'dashboardmean@gmail.com',
	        pass: 'mongoexpressangularnode'
	    }
	});


module.exports = function(app, express) {

	var apiRouter = express.Router();
	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {
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
	});




	// route middleware to verify a token excepting register
	apiRouter.use('/', function(req, res, next) {
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
	});





	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });
	});




	apiRouter.post('/sendRegister/:email/:username', function(req, res) {
		console.log('sending mail to ' + req.body.email + '----------------');

		var username = req.body.username;

		rand = Math.floor((Math.random() * 10000) + 100000);
		host = req.get('host');
	    link = "http://" + req.get('host') + "/verify?id=" + rand + "&username=" + username;

	    mailPayload = {
	    	from: 'dashboardmean@gmail.com',
		    to: req.body.email,
		    //to: 'nicovillalonga90@gmail.com',
		    subject: 'Confirmation Mail',
		    html: "<div marginwidth='0' marginheight='0' style='font-family: Lato,sans-serif; font-size: 15px; color: rgb(102, 102, 102);'><table color='#666666' align='center' bgcolor='#ffffff' border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr bgcolor='#ffffff'><td style='padding:10px 0;color:#ffffff' valign='top'></td></tr><tr bgcolor='#ffffff'><td height='10px'></td></tr><tr><td style='padding:0px 50px 0px 50px'><p><b><span style='font-size:23px'>Hello " + username +", Welcome to <span style='color:#e84c3d' target='_blank'> laGAGapp</a></span></b></p><h1><b> Please click on the button to verify your email</b>:</h1><a style='color:#ffffff;background:#e84c3d;padding:18px 25px;text-align:center;border-radius:8px;text-decoration:none;display:block' href=" + link + " target='_blank'>Click ME !!</a></td></tr></tbody></table></div>"
	    };

	    User.findOne({username: username}, function(err, user) {
	    	if (!err) {
	    		console.log('usr finded');
	    		//saves de random number to the user in case after email is sent page is close
	    		user.validatorId = rand;
	    		user.save(function(err) {
	    			if(!err) {
	    				console.log('rand saved: ' + rand);
	    				//after saving randId, email is sent
	    				transporter.sendMail(mailPayload, function(err, info) {
							if(err){
								console.log('mail NOT sent');
								console.log(err);
				    	    	res.status(500).send({message: 'Error while sending mail', err: err});
				    	    	//res.send(err);
						    } else {
						    	console.log('mail sent!');
						    	res.send('mail sent');
						    }

						    transporter.close();
						});
	    			}
	    		});
	    	}
	    });
	});




	app.get('/verify',function(req,res){
		var username = req.query.username;

		console.log(req.protocol + ":/" + req.get('host') + req.path);
		if((req.protocol + "://" + req.get('host')) === ("http://" + host)) {
		    console.log("Domain is matched. Information is from Authentic email");
		    if(req.query.id == rand) {
		        console.log("email is verified, username: " + username);

	        	User.findOne({username: username}, function(err, user) {
					if (err) return res.send(err);

					if(user){
		        		user.validated = true;
			        	user.save(function(err) {
			        		if (err) {
			        			console.log(err);
			        			res.send(err);
			        		}

			        		//res.json({success: true, message: 'User validated'});
			        		res.redirect('/verify/' + user.username);
			        	});
		        	} else {
		        		//error while retrieving user
		        		res.redirect('/verifyError');
		        	}
				});	
	        	
		    } else {
		    	//mismatch in randIds
		    	console.log("email is not verified");
    			res.redirect('/verifyError');
		    }
		} else {
		    console.log("Cuando este hosteado definir host como heroku.asd.. por si se corta el server");
		    //server was closed, then checks the url id with id in db
	    	/*
	    	console.log('email verified, session CLOSED');
	    	User.findOne({username: username}, function(err, user) {
				if (err) res.send(err);

		    	if(user && user.validatorId === req.query.id) {
		    		res.redirect('/verify/' + user.username);
		    	}
			});	
    		*/
		}
	});





	apiRouter.route('/register')
		.post(function(req, res) {
			// create a new instance of the User model
			var token,
				user = new User();
			// set the users information (comes from the request)
			user.email = req.body.email;
			user.username = req.body.username;
			user.password = req.body.password;
			user.hasConfirm = true;

			
			// save the user and check for errors
			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code === 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				token = jwt.sign(
									{
										email: user.email,
										username: user.username
									},
									superSecret,
									{
										expiresInMinutes: 1440 // expires in 24 hours
									}
								);

				res.json({ message: 'User created!.. email: ' + user.email + ' -- username: ' + user.username});
			});
		});





	// on routes that end in /users
	apiRouter.route('/users')
		// create a user (accessed at POST http://localhost:8080/api/users)
		.post(function(req, res) {
			// create a new instance of the User model
			var user = new User();
			// set the users information (comes from the request)
			user.email = req.body.email;
			user.username = req.body.username;
			user.password = req.body.password;
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
		})
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err) return res.send(err);
				// return the users
				res.json(users);
			});
		});
		/*.delete(function(req, res) {
			User.delete({}, function(err, user) {
				if (err) return res.send(err);
				res.json({ message: 'Successfully deleted' });
			});
		});*/




	// on routes that end in /users/:user_id
	apiRouter.route('/users/:user_id')
		// get the user with that id
		// (accessed at GET http://localhost:8080/api/users/:user_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) return res.send(err);
					// return that user
					res.json(user);
			});
		})
		// update the user with this id
		// (accessed at PUT http://localhost:8080/api/users/:user_id)
		.put(function(req, res) {
			// use our user model to find the user we want
			User.findById(req.params.user_id, function(err, user) {
				if (err) return res.send(err);
				//update the users info only if its new
				if (req.body.email) user.email = req.body.email;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) return res.send(err);
					res.json({ message: 'User updated!' });
				});
			});
		})
		// delete the user with this id
		// (accessed at DELETE http://localhost:8080/api/users/:user_id)
		.delete(function(req, res) {
			User.remove({ _id: req.params.user_id }, function(err, user) {
				if (err) return res.send(err);
				res.json({ message: 'Successfully deleted' });
			});
		});




	apiRouter.route('/userName/:username')
		.get(function(req, res) {
			User.find({username: req.params.username}, function(err, user) {
				if (err) return res.send(err);
				res.json(user);
			});	
		});


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


	apiRouter.route('/dashboards')
		.post(function(req, res) {
			
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
		});




	apiRouter.route('/dashboards/:owner')
		.get(function(req, res) {
			Dashboard.find({ $or: [{owner: req.params.owner}, {participants: {username: req.params.owner}} ]}, 
				function(err, dashboards) {
					if (err) return res.send(err);
					return res.json(dashboards);
			});
		});

		


	apiRouter.route('/dashboard/:_id')
		.get(function(req, res) {
			Dashboard.findById(req.params._id, function(err, dashboard) {
				if (err) return res.send(err);
				
				return res.json(dashboard);
			})
			.populate('lists');
		})


		.delete(function(req, res) {
			List.remove({dashboardId: req.params._id}, function(err, lists) {
				if (err) return res.send(err);
				
				Dashboard.remove({ _id: req.params._id }, function(err, dash) {
					if (err) return res.send(err);
					res.json({ message: 'Dashboard ' + req.params._id + ' Successfully deleted' });
				});
			});

		});


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



	/*
	apiRouter.route('/register')
		.post(function(req, res) {

		});
	*/

		
	return apiRouter;
};
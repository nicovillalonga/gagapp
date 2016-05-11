'use strict';

var User = require('../../models/user'),
	//directTransport = require('nodemailer-direct-transport'),
	nodemailer = require("nodemailer"),
	rand,
	host,
	link,
	mailPayload;

//i have a problem with nodemailer so i found this
//http://stackoverflow.com/questions/24876036/error-connect-eaddrnotavail
var transporter = nodemailer.createTransport('SMTP',{
		service: 'Gmail',
	    auth: {
	        user: 'dashboardmean@gmail.com',
	        pass: 'mongoexpressangularnode'
	    }
	});

module.exports = {
	sendRegister: function(req, res) {
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
	},

	verifyRegister: function(req,res){
		var username = req.query.username;

		console.log(req.protocol + ":/" + req.get('host') + req.path);
		if((req.protocol + "://" + req.get('host')) === ("http://localhost:8080")) {
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
			        		console.log(user.username);
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
	    	
	    	console.log('email verified, session CLOSED');
	    	User.findOne({username: username}, function(err, user) {
				if (err) res.send(err);

		    	if(user && user.validatorId === req.query.id) {
		    		res.redirect('/verify/' + user.username);
		    	}
			});
		}
	}


	/* this end point is not being used now..
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

			console.log('****************** REGISTER ************************');
			
			// save the user and check for errors
			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code === 11000)
						return res.json({ success: false, message: 'agagagagag'});
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
		});*/

}

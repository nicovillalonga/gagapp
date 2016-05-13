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
		var username = req.body.username;
		console.log('sending mail to ' + req.body.email + '----------------');

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

	    User.findOne({username: username}).exec()
	    .then(function(user) {
			//saves de random number to the user in case after email is sent page is close
			user.validatorId = rand;
			return user.save();
	    })
		.then(function(user) {
			//after saving validatorId, email is sent
			console.log('user saved: ' + user.username + ', with validatorId: ', rand);
			return transporter.sendMail(mailPayload);
		})
		.then(function(info) {
	    	console.log('mail sent!');
	    	res.send('mail sent');
		})
		.catch(function(err) {
			console.log('mail NOT sent');
			console.log(err);
	    	res.status(500).send({message: 'Error while sending mail', err: err});
		});
	},

	verifyRegister: function(req,res){
		var username = req.query.username;
		console.log(req.protocol + "://" + req.get('host') + req.path);
		console.log("Domain is matched. Information is from Authentic email");

	    User.findOne({username: username}).exec()
	    .then(function(user) {
			user.validated = true;
	    	return user.save();
		})
		.then(function() {
			//res.json({success: true, message: 'User validated'});
			console.log("email is verified, username: " + username);
			res.redirect('/verify/' + username);
		})
		.catch(function(err) {
			res.redirect('/verify/' + username);
		})
	}
}

// BASE SETUP
// ======================================
// CALL THE PACKAGES --------------------
var path = require('path'),
	express = require('express'), // call express
	app = express(), // define our app using express
	config = require('./config'),
	bodyParser = require('body-parser'), // get body-parser
	morgan = require('morgan'), // used to see requests
	mongoose = require('mongoose'), // for working w/ our database
	apiRouter = express.Router(), // get an instance of the express router
	apiRoutes = require('./app/routes/api')(app, express);
	/*User = require('./app/models/user'),
	jwt = require('jsonwebtoken'),
	superSecret = config.secret;*/


// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});


// log all requests to the console
app.use(morgan('dev'));


//database connection
//mongoose.connect(config.database);


// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// more routes for our API will happen here
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRoutes);


// ROUTES FOR OUR API
// =============================
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START THE SERVER
// ===============================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
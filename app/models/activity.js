// grab the packages that we need for the activity model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	// activity schema	
	ActivitySchema = new Schema({	  	
	  	type: { type: String, required: true},
	  	user: { type: String, required: true},
	  	date: { type: Date, default: Date.now}
	});

// return the model
module.exports = mongoose.model('Activity', ActivitySchema);
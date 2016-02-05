// grab the packages that we need for the activity model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	// activity schema	
	ActivitySchema = new Schema({
	  	id: {type: String, required: true, unique: true},
	  	type: { type: String},
	  	user: { type: String},
	  	date: { type: Date}
	});

// return the model
module.exports = mongoose.model('Activity', ActivitySchema);
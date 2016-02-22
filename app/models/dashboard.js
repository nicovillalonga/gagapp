// grab the packages that we need for the dasboard model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	// dashboard schema
	DashboardSchema = new Schema({
	  	id: {type: String},
	  	text: { type: String, required: true, index: { unique: true }},
	  	owner: { type: String, required: true},
	  	actualSprint: {type: Number, required: true},
	  	participants: [],
	  	sprints: [],
	  	lists: []
	});

// return the model
module.exports = mongoose.model('Dashboard', DashboardSchema);
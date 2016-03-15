// grab the packages that we need for the dasboard model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),	
	List = require('./list')
	// dashboard schema
	DashboardSchema = new Schema({
	  	text: { type: String, required: true, index: { unique: true }},
	  	owner: { type: String, required: true},
	  	actualSprint: {type: Number, required: true},
	  	version: { type: Number, default: 0},
	  	participants: [],
	  	sprints: [],
	  	lists: [{ type: Schema.Types.ObjectId, ref: 'List' }]
	});

// return the model
module.exports = mongoose.model('Dashboard', DashboardSchema);
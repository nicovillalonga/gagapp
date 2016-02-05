// grab the packages that we need for the task model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	// taks schema
	TaskSchema = new Schema({
	  	id: {type: String, required: true, unique: true},
	  	index: { type: Number},
	  	sprint: { type: Number},
	  	storyPoints: { type: Number},
	  	priority: { type: Number},
	  	name: { type: String},
	  	description: { type: String},
	  	activities: []
	});

// return the model
module.exports = mongoose.model('Task', TaskSchema);
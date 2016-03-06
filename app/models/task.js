// grab the packages that we need for the task model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	Activity = require('./activity')
	// taks schema
	TaskSchema = new Schema({
	  	index: { type: Number, default: 0},
	  	sprint: { type: Number, default: 0},
	  	storyPoints: { type: Number},
	  	priority: { type: Number},
	  	name: { type: String, required: true},
	  	description: { type: String},
	  	asignedTo: { type: String},
	  	activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
	});

// return the model
module.exports = mongoose.model('Task', TaskSchema);
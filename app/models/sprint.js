// grab the packages that we need for the sprint model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	// sprint schema
	SprintSchema = new Schema({
	  	//id: { type: String, required: true, unique: true },
	  	sprint: { type: Number },
	  	startDate: { type: Date, required: true },
	  	endDate: { type: Date },
	  	tasks: []
	});

// return the model
module.exports = mongoose.model('Sprint', SprintSchema);
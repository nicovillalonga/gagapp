// grab the packages that we need for the list model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),
	Dashboard = require('./dashboard'),
	Task = require('./task')
	// list schema	
	ListSchema = new Schema({
		dashboardId: { type: Schema.Types.ObjectId, ref: 'Dashboard' },
	  	name: { type: String, required: true },
	  	orderId: { type: Number },
	  	tasks: []
	});

// return the model
module.exports = mongoose.model('List', ListSchema);
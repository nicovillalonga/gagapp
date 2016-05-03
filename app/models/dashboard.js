// grab the packages that we need for the dasboard model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs'),	
	List = require('./list'),
	// dashboard schema
	DashboardSchema = new Schema({
	  	text: { type: String, required: true, index: { unique: true } },
	  	owner: { type: String, required: true },
	  	actualSprint: { type: Number, required: true },
	  	actualSprintId: { type: String },
	  	version: { type: Number, default: 0 },
	  	participants: [],
	  	sprints: [],
	  	lists: [{ type: Schema.Types.ObjectId, ref: 'List' }]
	});

/*DashboardSchema.pre('remove', function(next) {
	var dashboard = this;
	dashboard.model('Sprint').update(
		{ sprints: { $in: dashboard.sprints } },
		{ $pull: { dashboard. } }
	);
});*/


// return the model
module.exports = mongoose.model('Dashboard', DashboardSchema);
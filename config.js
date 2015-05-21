
module.exports = {
	'port': process.env.PORT || 8080,
	'database': 'mongodb://localhost/mmachineExpress',
	'secret': 'ilovescotchscotchyscotchscotch'
};


/*
var env = process.env.NODE_ENV || 'development';
	user = "gadb",
	password = "probandom0ng0",
address = "@ds033607.mongolab.com:33607/agdb",
	url = 'mongodb://' + user + ':' + password + address;
	//address = "ds045057.mongolab.com:45057/gadb",
	//url = 'mongo ' + address + ' -u ' + user + ' -p ' + password;

module.exports = {
	'port': process.env.PORT || 8080,
	'database': url,
	'secret': 'ilovescotchscotchyscotchscotch'
};
*/

/*
var mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	user = "gadb",
	password = "probandom0ng0",
	address = "@ds033607.mongolab.com:33607/agdb",
	url = 'mongodb://' + user + ':' + password + address;
 //address = "ds045057.mongolab.com:45057/gadb",
 //url = 'mongo ' + address + ' -u ' + user + ' -p ' + password;

module.exports = {
 'port': process.env.PORT || 8080,
 'database': url,
 'secret': 'ilovescotchscotchyscotchscotch'
};

mongoose.connect(url);
*/
//NICO
/*
module.exports = {
	'port': process.env.PORT || 8080,
	'database': 'mongodb://localhost/mmachineExpress',
	'secret': 'ilovescotchscotchyscotchscotch'
};
*/







//AGUS

var mongoose = require('mongoose');

module.exports = {
	'port': process.env.PORT || 8080,
	'database': 'mongodb://localhost/mmachineExpress',
	'secret': 'ilovescotchscotchyscotchscotch'
};


/** Conexion a MongoLab */

var user = "gadb";
var password = "probandom0ng0";
//var address = "@ds031882.mongolab.com:31882/meanapp";
var address = "@ds045057.mongolab.com:43200/gadb";

var url = 'mongodb://' + user + ':' + password + address;

var options = {
  db: { native_parser: true },
  server: { poolSize: 5, 
            keepAlive: 1 },
  replset: { rs_name: 'myReplicaSetName' },
  user: 'gadb',
  pass: 'probandom0ng0'
} 

mongoose.connect(url);

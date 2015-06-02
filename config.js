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

var user = "agusburgos";
var password = "aprendiendo";
//var address = "@ds031882.mongolab.com:31882/meanapp";
var address = "@ds043200.mongolab.com:43200/aprendiendo";

var url = 'mongodb://' + user + ':' + password + address;

var options = {
  db: { native_parser: true },
  server: { poolSize: 5, 
            keepAlive: 1 },
  replset: { rs_name: 'myReplicaSetName' },
  user: 'agusburgos',
  pass: 'aprendiendo'
} 

mongoose.connect(url);

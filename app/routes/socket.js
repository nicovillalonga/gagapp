//number of connections
var connections = 0;

module.exports = function (socket) {
	//count number of connections	
	connections++;
	console.log('connected', connections);
	
	//when an event 'user:new' is emited on the client, this metod is called
	socket.on('user:new', function (data) {
		console.log('socket server: ' + data);
		//then emit the update with the new data
		socket.broadcast.emit('user:update', {
			user: data
		});
	});

	socket.on('user:delete', function (data) {
		console.log('delete');
		socket.broadcast.emit('user:update', {});
	});

	//
	socket.on('disconnect', function() {
	    connections--;
	    console.log('connected', connections);	    
	});
};
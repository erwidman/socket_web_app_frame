
var clients = {};

class SocketManager{
	constructor(app){	
		this.numRooms = 1;	
		this.rooms = {};
		this.io = require('socket.io')(app);
	}

	getIO(){
		return this.io;
	}

	setRoomEvents(roomDefinitions){

	

		this.io.on('connect',function(socket){
	
			var socketRoom = socket.handshake.query.room;
			socket.join(socketRoom);

			var currRoom = roomDefinitions[socketRoom];
			if(!this.rooms[socketRoom]){
				this.rooms[socketRoom] = {};
				this.numRooms++;
			}
			else
				return;
			
			console.log("::creating eventhandlers for "+ socketRoom);
		
			var currRoom = roomDefinitions[socketRoom];
			this.rooms[socketRoom].events = currRoom.events;
			for(var j in currRoom.events){
				var currEvent = currRoom.events[j];
				var eventName = currEvent.name;
				var callback = currEvent.callback;
				console.log('::creating event ' + eventName);
				socket.on(eventName,callback);
			}
		
		});
	}

}

module.exports = SocketManager;

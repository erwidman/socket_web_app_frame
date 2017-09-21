
var clients = {};

class SocketManager{
	constructor(app){		
		this.io = require('socket.io')(app);
	}

	getIO(){
		return this.io;
	}

	setRoomEvents(roomDefinitions){

		this.io.on('connect',function(socket){
			console.log(socket.id);
			var socketRoom = socket.handshake.query.room;
			socket.join(socketRoom);
		
			var def = roomDefinitions[socket.handshake.query.type];
			if(def){
				for(var i in def.events){
					var currEvent = def.events[i];
					var eventName = currEvent.name;
					var callback = currEvent.callback;
					socket.on(eventName,callback);
				}
			}
		
		});
	}

	respond(event,data,socket){
		data = JSON.stringify(data);
		this.io.to(socket.id).emit(event,data);
	}

	respondToRoom(event,data,room){
		data = JSON.stringify(data);
		this.io.to(room).emit(event,data);
	}

	globalRespond(event,data){
		data = JSON.stringify(data);
		this.io.emit(event,data);
	}

}

module.exports = SocketManager;

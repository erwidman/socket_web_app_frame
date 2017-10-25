
var clients = {};

class SocketManager{
	constructor(app){		
		this.io = require('socket.io')(app);
		this.siofu = require('socket.io-file');
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

	createFileStream(uploadDir,acceptedfiles,maxFileSize,overwrite,stremCallback){
		this.io.on('connection',function(socket){
			var fileStream = new SocketIOFile(socket,{
				uploadDir : uploadDir,
				accepts : acceptedFiels,
				maxFileSize : maxFileSize,
				chunkSize: 10240,
				transmissionDelay: 0,
				overwrite: overwrite
			});

			fileStream.on("start",function(fileInfo){
				console.log('::STARTING FILE UPLOAD!');
			});

			fileStream.on('stream',function(fileInfo){
				streamCallback(fileInfo);
			});

		});
		
	}

}

module.exports = SocketManager;

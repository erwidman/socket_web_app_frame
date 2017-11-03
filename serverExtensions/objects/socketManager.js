
/*
	@author : ERIC RICHARD WIDMANN
	Used to manage socket.io connections and events

	@params
	app : active http server object
*/
var clients = {};
const SocketIOFile =  require('socket.io-file');


class SocketManager{
	constructor(app){		
		this.io = require('socket.io')(app);
	}

	/*
		returns the io object associated with this object
	*/
	getIO(){
		return this.io;
	}

	/*
		Sets the definitions for the various socket types to be recieved. Room definitions takes the format of
		{
			'socket_type': 
			{
				events:[
							{
								name: 'attempt_login',
								callback : function(data){
									//attempt to login with data recieved
								}
							},
							......
					   ]
				alwaysJoin: "some_room"
			},
			...


		}
	*/
	setRoomEvents(roomDefinitions){

		this.io.on('connect',function(socket){
			console.log(socket.id);
			var socketRoom = socket.handshake.query.room;
			socket.join(socketRoom);
		
			var def = roomDefinitions[socket.handshake.query.type];
			if(def){
				if(def.alwaysJoin)
					socket.join(def.alwaysJoin);
				for(var i in def.events){
					var currEvent = def.events[i];
					var eventName = currEvent.name;
					var callback = currEvent.callback;
					socket.on(eventName,callback);
				}
			}
		
		});
	}

	/*
		Used to respond to a specific socket

		@params:
		event: name of event being emitted
		data: data to be sent
		socket: the socket to recieve the data
	*/
	respond(event,data,socket){
		data = JSON.stringify(data);
		this.io.to(socket.id).emit(event,data);
	}

	/*
		Used to send data to an entire room

		@params:
		event : event to be emitted 
		data : data to be sent
		room : the target room of the data
	*/
	respondToRoom(event,data,room){
		data = JSON.stringify(data);
		this.io.to(room).emit(event,data);
	}

	/*
		Used to send data to all active sockets

		@params
		event: name of event
		data: data to be sent 
	*/
	globalRespond(event,data){
		data = JSON.stringify(data);
		this.io.emit(event,data);
	}

	/*
		Used to enable a file stream to local server

		@params
		uploadDir : object specifing possible directories for file uploads - example
			{
				"pics"  : "data/img",
				"videos" : "data/videos"
			} 
		acceptedfiles : an array of the accepted file typess -example 
			[
				'image/jpeg',
				'image/png'
			]
		maxFileSize : The maximum file size in bytes
		overwrite : boolean value signifing wheather file overwrites are enabled 
		callbacks : object defining function to be called at different stages of the file uploads - example 
			{
				start : function(fileInfo){
	
				},
				stream : function(fileInfo){
	
				},
				complete : function(fileInfo){
	
				},
				error : funcction(err){
	
				},
				abort : function(fileInfo){
	
				}
			},
	  	type: the socket type that the file stream applies too
	*/
	//createFileStream(uploadDir,acceptedfiles,maxFileSize,overwrite,rename,callbacks,type){
	createFileStream(options){
		var uploadDir = options.uploadDir;
		var acceptedfiles = options.acceptedFiles;
		var maxFileSize = options.maxFileSize;
		var overwrite = options.overwrite;
		var rename = options.rename;
		var callbacks = options.callbacks;
		var type = options.type;
		this.io.on('connection',function(socket){
			
			if(type && type == socket.handshake.query.type)
				return;
			


			var fileStream = new SocketIOFile(socket,{
				uploadDir : uploadDir,
				accepts : acceptedfiles,
				maxFileSize : maxFileSize,
				chunkSize: 10240,
				transmissionDelay: 0,
				overwrite: overwrite
			});

			fileStream.on("start",function(fileInfo){
				console.log('::STARTING FILE UPLOAD!');
				if(callbacks && callbacks.start)
					callbacks.start(fileInfo);
			});

			fileStream.on('stream',function(fileInfo){
				if(callbacks && callbacks.stream)
					callbacks.stream(fileInfo);
			});

			fileStream.on('complete',function(fileInfo){
				if(callbacks && callbacks.complete)
					callbacks.complete(fileInfo);
			});

			fileStream.on('error',function(fileInfo){
				if(callback&& callbacks.error);
					callbacks.error(fileInfo);
			});

			fileStream.on('abort',function(fileInfo){
				console.log("::UPLOAD ABORTED!");
				if(callback && callbacks.error)
					callbacks.abort(fileInfo);
			});


		});
	}

	/*
		Forces all sockets in a certain room out of that room
	*/
	destroyRoom(room){
		for(var s in sManager.getIO().of('/').in(room).clients)
    		s.leave(room);
	}

}

module.exports = SocketManager;

var jQuery = require('jquery');


class Socket{
	
	constructor(options){
		
		this.ip = options.ip;
		this.room = options.room;
		this.persist = options.persist;
		this.query = {query:'room='+options.room+'&type='+options.type};
		var query = this.query;
		var it = this;

		function setSocket(tmpSocket){

			
			it.emitEnabled = true;
			it.sok = tmpSocket;
			if(options.listeners)
				it.setListeners(options.listeners);
			if(options.streamOptions){
		 		it.setUploaderSettings(options.streamOptions);
		 	}
		
		
		}

		var scriptURL = options.ip+'/socket.io/socket.io.js';
		var tmpSocket;
		jQuery.getScript(scriptURL,function(data,textStatus,jqxhr){
				 let tmpSocket =  io.connect(options.ip,query);
				 setSocket(tmpSocket);
				 if(!options.persist){
					 tmpSocket.once('connect',function(){
						this.io.disconnect();
					});
				}
		});
	
	}



	sendToServer(event,killEvent,data, callback){
		
		if(this.emitEnabled){

			var persist = this.persist;
			data = {data: data, returnEvent: killEvent};
			if(!persist){
				this.reloadSocket();
				this.sok.once('connect',function(socket){
					console.log(this);
					this.emit(event,data);
				});
			}
			else
				this.sok.emit(event,data);

			this.sok.once(killEvent,function(returnData){
				callback(returnData);
				if(!persist)
					this.io.disconnect();
			});
		}
		else{
			setTimeout(function(socket){
				socket.sendToServer(event,killEvent,data, callback);
			},100,this);
		}

	}

	setListeners(listenDefinitions){
		if(this.emitEnabled){
			if(this.persist){
				for(var i in listenDefinitions){
					var currDef = listenDefinitions[i];
					this.sok.on(currDef.event,currDef.callback);
				}
			}
		}
		else{
			setTimeout(function(socket){
				socket.setListeners(listenDefinitions);
			},100,this);
		}
	}
	

	listenUntil(event,callback){
		if(!this.persist){
			this.reloadSocket();
			this.sok.once(event,function(data){
				callback(data);
				this.io.disconnect();
			});
		}
	}

	reloadSocket(){
		this.sok =  io.connect(this.ip,this.query);
	}

	setUploaderSettings(options){
		
		if(!this.uploader)
			this.uploader = new SocketIOFileClient(this.sok);

		this.uploader.off('start stream complete error abort');
		
		this.uploader.on('start',function(fileInfo){
			console.log("::STARTING UPLOAD");
			if(options.start)
				options.start(fileInfo);
		});
		this.uploader.on('stream',function(fileInfo){
			if(options.stream)
				options.stream(fileInfo);
		});
		this.uploader.on('complete',function(fileInfo){
			if(options.complete)
				options.complete(fileInfo);
		});
		this.uploader.on('error',function(err){
			if(options.error)
				options.error(err);
		});
		this.uploader.on('abort',function(fileInfo){
			if(options.abort)
				options.abort(fileInfo);
		});
			
	}

}//end of class
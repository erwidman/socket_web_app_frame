var jQuery = require('jquery');


class Socket{
	
	constructor(ip,room,type,persist,listeners){
		
		this.ip = ip;
		this.room = room;
		this.persist = persist;
		this.query = {query:'room='+room+'&type='+type};
		var query = this.query;

		setSocket(this);
		var scriptURL = ip+'/socket.io/socket.io.js';
		var tmpSocket;
		jQuery.getScript(scriptURL,function(data,textStatus,jqxhr){
				 tmpSocket =  io.connect(ip,query);
				 if(!persist){
					 tmpSocket.once('connect',function(){
						this.io.disconnect();
					});
				}

		});

		//attempt to set sok variable 
		var waitFunction;
		function setSocket(s){
			clearTimeout(waitFunction);
			waitFunction = 
			setTimeout(function(){
				if(tmpSocket){
					s.emitEnabled = true;
					s.sok = tmpSocket;
					if(listeners)
						s.setListeners(listeners);
				}
				else{
					setSocket(s);
				}
			},100);
		}
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
				socket.sendToServer(event,data,killEvent, callback);
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

}//end of class
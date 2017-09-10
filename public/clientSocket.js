var jQuery = require('jquery');

function setSocket(sok){
	tmpClass.sok = sok;
}


class Socket{
	


	constructor(ip,room,type,persist){
		
		this.ip = ip;
		this.room = room;
		this.persist = persist;

		setSocket(this);
		var scriptURL = ip+'/socket.io/socket.io.js';
		var tmpSocket;
		jQuery.getScript(scriptURL,function(data,textStatus,jqxhr){
				 tmpSocket =  io.connect(ip,{query:'room='+room+'&type='+type});
				 if(!persist){
					 tmpSocket.once('connect',function(){
						this.disconnect();
					});
				}
		});

	
		var waitFunction;
		function setSocket(s){
			clearTimeout(waitFunction);
			waitFunction = 
			setTimeout(function(){
				if(tmpSocket){
					s.emitEnabled = true;
					s.sok = tmpSocket;
					console.log(tmpSocket);
				}
				else{
					setSocket(s);
				}
			},100);
		}

		setTimeout(function(fix){
			console.log(fix);
		},1000,this);
	}

	sendToServer(event,killEvent,data,callback){
		var persist = this.persist;
		data = {data: data, returnEvent: killEvent};
		console.log(data);
		if(this.emitEnabled){
			if(!persist){
				this.sok.connect();
				this.sok.once('connect',function(){
					this.emit(event,data);
				});
			}
			else
				this.sok.emit(event,data);

			this.sok.once(killEvent,function(returnData){
				callback(returnData);
				if(!persist)
					this.disconnect();
			});
		}
	}

}//end of class
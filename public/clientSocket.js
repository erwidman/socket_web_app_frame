var jQuery = require('jquery');

function setSocket(sok){
	tmpClass.sok = sok;
}


class Socket{
	


	constructor(ip,room){
		
		this.ip = ip;
		this.room = room;
		this.emitEnabled = true;

		var connected = false;
		var tmpClass = this;
		var scriptURL = ip+'/socket.io/socket.io.js';
		jQuery.getScript(scriptURL,function(data,textStatus,jqxhr){
				 var tmpSocket =  io.connect(ip,{query:'room='+room});
				 tmpSocket.once('connect',function(){
					console.log('::socket succesfully instantiated' + room);
					this.disconnect();
					//todo
				});
		});
	

	}

	sendToServer(data){
		if(this.emitEnabled){
			this.sok.connect();
			this.sok.once('connect',function(socket){
				this.sok.emit('sendData',data);
			});
		}
	}

}//end of class
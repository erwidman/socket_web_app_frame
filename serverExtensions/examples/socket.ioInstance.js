
var SocketManager = require('../objects/socketManager.js');
var socketDefinitions =
{
		"main": {
			events: 
				[
					{
					name: 'sendData',
					callback : 
							function(data){
								console.log(data);
								manager.respond(data.returnEvent,true,this);
								manager.respond('sampleData','sampleData',this);
							}
					},
					{	
					name: 'requestData',
					callback : 
							function(data){
								console.log(data);
								manager.respond(data.returnEvent,true,this);
							}

					}

				]

		},
		"secondary" :{
			events:
				[
					{
						name: 'test',
						callback: function(data){
							console.log(data);
							manager.respond(data.returnEvent,'test response',this);
						}
					}

				]
		}
};


var manager;
module.exports = function(server){
	manager = new SocketManager(server);
	manager.setRoomEvents(socketDefinitions);
};

//____________________________________________________EXAMPLE







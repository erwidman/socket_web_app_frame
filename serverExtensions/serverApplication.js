var SocketManager = require('./objects/socketManager.js');
var DataHandler = require('./objects/dataHandler.js');
var SQLHandler = require('./objects/sqlHandler.js');

var manager;
module.exports = function(server){
	manager = new SocketManager(server,false);
	dbHandler = new SQLHandler('internal-dev.cmdjf9dcmjok.us-east-1.rds.amazonaws.com',
 							"bowling_user",
 							"QxeZsMyH78hKcbw",
 							'bowling');	
	//manager.setRoomEvents(socketDefinitions);
};


var dHandler = new DataHandler('internal-dev.cmdjf9dcmjok.us-east-1.rds.amazonaws.com',
							"bowling_user",
							"QxeZsMyH78hKcbw",
							'bowling'); 



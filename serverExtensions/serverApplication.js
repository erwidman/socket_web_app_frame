var SocketManager = require('./objects/socketManager.js');
var DataHandler = require('./objects/dataHandler.js');
var SQLHandler = require('./objects/sqlHandler.js');
var settings = require('./settings/settings.js');

var manager;
var sManager;
var dataManager;
var dbManager;
module.exports = function(server){
	sManager = new SocketManager(server);
	// dbHandler = new SQLHandler(
								// 'host',
 // 							"user",
 // 							"password",
 // 							'database');	
	dataHandler = new DataHandler(); 
};





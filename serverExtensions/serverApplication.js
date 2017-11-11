var SocketManager = require('./objects/socketManager.js');
var DataHandler = require('./objects/dataHandler.js');
var SQLHandler = require('./objects/sqlHandler.js');
var settings = require('./settings/settings.js');
const serverLogger = require('./objects/serverLogger.js');

var manager;
var sManager;
var dataManager;
var dbManager;
var logger;
module.exports = function(server){
	console.log('EXTENSION FOUND');
	//sManager = new SocketManager(server);
	// dbHandler = new SQLHandler(
								// 'host',
 // 							"user",
 // 							"password",
 // 							'database');	
	//dataHandler = new DataHandler(); 
	logger = new serverLogger(false);
	setTimeout(function(){
		logger.log("this");

		logger.log('is');
		logger.log('a');
		logger.log('test');
	},2000);

};





const fs = require('fs');
const SocketManger = require('./socketManager.js');
const {spawn} = require('child_process');
//const Worker = require('tiny-worker');

class ServerLogger{

	constructor(printToConsole,port,ready){
		var it = this;
		this.printToConsole = printToConsole;
		this.serverReady = false;
		this.logFileExist = false;


		function _initSocketServer(){
			it.sManager = new SocketManger(port);
			it.sManager.setRoomEvents({
				'server_logger' :
					{
						events: 
						[
							{
								name : 'getTail',
								callback : function(data){

									var requestingSocket = this;
									var outerData = data
									const child = spawn('tail',['-n','50','log/log.txt']);
									child.stdout.on('data',function(data){
										it.sManager.respond(outerData.returnEvent,data.toString('utf-8'),requestingSocket);
									});
									child.stderr.on('data',function(data){
										console.log(data.toString('utf-8'));
									});
								}
							}
						]
					}
			});
			it.serverReady = true;
			ready();

		}


		fs.stat('log',function(err,stats){
			if(err){
				console.log("::CREATING DIRECTORY FOR SERVER LOG");
				fs.mkdir('log',function(err){
					if(err)
						console.log('::FAILED TO CREATE DIRECTORY');
					else{
						console.log('::LOG DIRECTORY CREATED!');
						_initSocketServer();
					}
				});
			}
			else{
				console.log("::LOG DIRECTORY EXIST");
				_initSocketServer();
			}
		});


	}

	log(msg){
		var it = this;
		if(!this.serverReady){
			console("::LOG SERVER NOT READY FOR OPERATION");
			return;
		}

		if(!this.logFileExist){
		 	fs.open('log/log.txt','wx',function(err,fd){
		 		if(err){
		 			console.log("::FILE ALREADY EXIST");
		 			it.logFileExist = true;
		 			return;
		 		}
				fs.close(fd,function(err){
					console.log("::FILE CLOSED");
				});
		 		it.logFileExist = true;
		 	});
	 	}


	 	fs.appendFile('log/log.txt','\n'+msg,function(err){
	 		if(err)
	 			console.log("::FAILED TO APPEND TO LOG.TXT");
	 	})

	 	this.sManager.globalRespond("serverLOG",{'msg':'\n'+msg});

	 	if(this.printToConsole)
	 		console.log(msg);
		
	}

	isReady(){
		return this.serverReady;
	}



}

module.exports = ServerLogger;
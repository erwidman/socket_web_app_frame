const fs = require('fs');
const io = require('socket.io');
const Worker = require('tiny-worker');

class serverLogger{

	constructor(printToConsole){
		
		this.directoryExist = false;
		this.printToConsole = printToConsole;



		var directoryCheck = setInterval(_directoryExist,30,this);
		function _directoryExist(it){
			if(dirExist){
				console.log("::CLEARING DIRECTOY CHECK FUNCTION")
				it.directoryExist = true;
				clearInterval(directoryCheck);
			}
		}


		var dirExist = false;
		fs.stat('log',function(err,stats){
			if(err){
				console.log("::CREATING DIRECTORY FOR SERVER LOG");
				fs.mkdir('log',function(err){
					if(err)
						console.log('::FAILED TO CREATE DIRECTORY');
					else{
						dirExist = true;
						console.log('::LOG DIRECTORY CREATED!');
					}
				});
			}
			else{
				dirExist = true;
				console.log("::LOG DIRECTORY EXIST")
			}
		});



		//inline-worker
		this.worker = new Worker(function(){
			const fs = require('fs');
			self.onmessage = function(ev){	
				fs.appendFile('log/log.txt',ev.data + '\n',function(err){
						if(err)
							postMessage("FAILED");
						else
							postMessage("::SUCCESSFUL LOG");
				});
			}
		});


		this.worker.onmessage = function(ev){
				if(ev.data == 'FAILED'){
					console.log("::LOGGER FAILURE");
					this.terminate();
				}
		}



	}

	log(msg){
	
		//console.log(this.worker);
		if(!this.directoryExist){
			return;
		}

		if(this.printToConsole)
			console.log(msg);

		setTimeout(function(it){
			it.worker.postMessage(msg);
		},2000,this);
		
	}


	killWorker(){
		this.worker.terminate();
	}


}

module.exports = serverLogger;
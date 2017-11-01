var SocketManager = require('../objects/socketManager.js');

var manager;
module.exports = function(server){
	manager = new SocketManager(server);
	init();
};


function init(){
	manager.createFileStream({
		images : 'data/img',
		videos : 'data/videos'
	},
	['image/jpeg'],
	4194304,
	true);
}
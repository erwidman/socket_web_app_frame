var SocketManager = require('../objects/socketManager.js');

var manager;
module.exports = function(server){
	manager = new SocketManager(server);
	init();
};


function init(){
	manager.createFileStream({
	uploadDir :{
		images : 'data/img',
		videos : 'data/videos'
	},
	acceptedFiles : ['image/jpeg'],
	maxFileSize: 4194304,
	overwrite : true});
}
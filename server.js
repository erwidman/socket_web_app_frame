
//____________________________________________________APP_INSTANTIATE
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

app.use(express.static('public'));
app.use(express.static('socket.io/socket.io.js'));

server.listen(4040);

const ServerLogger = require('./serverExtensions/objects/serverLogger.js');
var logger = new ServerLogger(true,8000,function(){
	setTimeout(function(){
		logger.log("::A FORMAL TEST OF THE SYSTEM");
	},30*1000);
});

//require('./serverExtensions/tester.js')();
// require('./serverExtensions/socket.ioInstance.js')(server);






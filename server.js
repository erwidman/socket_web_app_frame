var fs = require('fs');
var express = require('express');
var vm = require('vm');
var http = require('http');
var striptags = require('striptags');
var validator = require('validator');
const SocketManager = require('./socketManager.js');

var app = express();
var server = http.createServer(app);
app.use(express.static('public'));
app.use(express.static('socket.io/socket.io.js'));

//start file server and socket.io
server.listen(4040);
var manager = new SocketManager(server);


//example
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


manager.setRoomEvents(socketDefinitions);


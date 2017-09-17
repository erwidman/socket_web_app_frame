

var vm = require('vm');

var striptags = require('striptags');
var validator = require('validator');



//____________________________________________________APP_INSTANTIATE
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.use(express.static('public'));
app.use(express.static('socket.io/socket.io.js'));
app.use('/boot', express.static('/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
server.listen(4040);




//____________________________________________________JSONRY/DATA
const DataHandler = require('./dataHandler.js');
var dHandler = new DataHandler(); 

var stores = {
  "store": {
    "book": [ 
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      }, {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }, {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      }, {
         "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
};

dHandler.saveObject('stores',stores);

setTimeout(function(){
	
	dHandler.queryObject('stores','$..book[?(@.price<10)]',function(data){
		console.log(data);
	});
},5000);

//____________________________________________________SOCKET_SETUP
const SocketManager = require('./socketManager.js');
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


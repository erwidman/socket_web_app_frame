
//____________________________________________________APP_INSTANTIATE
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
app.use(express.static('public'));
app.use(express.static('socket.io/socket.io.js'));
app.use('/boot', express.static('/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
server.listen(4040);



// var vm = require('vm');
// var fs = require('fs');
// var data_handler_plugin = fs.readFileSync('serverPlugins/dataHandler.plugin.js');
// vm.runInThisContext(data_handler_plugin);

require('./serverExtensions/dataHandlerInstance.js');
require('./serverExtensions/socket.ioInstance.js')(server);


// var striptags = require('striptags');
// var validator = require('validator');
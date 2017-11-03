
//____________________________________________________APP_INSTANTIATE
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

app.use(express.static('public'));
app.use(express.static('socket.io/socket.io.js'));

server.listen(4040);

require('./serverExtensions/examples/socket.io.files.js')(server);
// require('./serverExtensions/socket.ioInstance.js')(server);






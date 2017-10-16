
//____________________________________________________APP_INSTANTIATE
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

app.use(express.static('public'));
app.use(express.static('socket.io/socket.io.js'));
app.use('/boot', express.static('/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
server.listen(4040);

require('./serverExtensions/serverApplication.js')(server);
// require('./serverExtensions/socket.ioInstance.js')(server);






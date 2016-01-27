var http = require('http');
var requestHandler =  require('./routing.js');
var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP;
var PORT = process.env.OPENSHIFT_NODEJS_PORT ||  8080;
var games={};
var controller = requestHandler(games);

var server = http.createServer(controller);
server.listen(PORT,IP_ADDRESS);


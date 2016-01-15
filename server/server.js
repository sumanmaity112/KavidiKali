var http = require('http');
var requestHandler =  require('./routing.js');
const PORT=process.env.HOST_PORT || 8080;
var games={};
var controller = requestHandler(games);

var server = http.createServer(controller);
server.listen(PORT,function(){
	console.log('server is listen on ',PORT);
});


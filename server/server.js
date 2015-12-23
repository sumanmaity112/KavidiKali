var http = require('http');
var controller =  require('./routing.js');
const PORT=8080;

var server = http.createServer(controller);
server.listen(PORT,function(){
	console.log('server is listen on ',PORT);
});


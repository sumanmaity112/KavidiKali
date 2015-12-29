var http = require('http');
var requestHandler =  require('./routing.js');
const PORT=8080;
var Game = require('./../javascript/sourceCode/game.js');
var game = new Game([6],5,[1,2,3,4,5,6]);
var controller = requestHandler(game);

var server = http.createServer(controller);
server.listen(PORT,function(){
	console.log('server is listen on ',PORT);
});


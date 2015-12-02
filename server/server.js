var http = require('http');
var EventEmitter = require('events').EventEmitter;
var routes = require('./routes.js');
var lib = require('../javascript/sourceCode/kavidikaliLib.js').entities;
var get_handlers = routes.get_handlers;
var post_handlers = routes.post_handlers;
var rEmitter = new EventEmitter();
var querystring = require('querystring');
var gameMaster ;
const PORT = 8080;

var matchHandler = function(url){
	return function(ph){
		return url.match(new RegExp(ph.path));
	};
};

rEmitter.on('next', function(handlers, req, res, next,gameMaster){
	if(handlers.length == 0) return;
	var ph = handlers.shift();
	ph.handler(req, res, next,gameMaster);
});

var handle_all_post = function(req, res, gameMaster){
	var handlers = post_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, gameMaster, next);
	};
	next();
}; 

var handle_all_get = function(req, res, gameMaster){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){
		rEmitter.emit('next', handlers, req, res, gameMaster, next );
	};
	next();
};

var requestHandler = function(req, res){
	console.log(req.method, req.url);
	if(req.method == 'GET')
		handle_all_get(req, res, gameMaster);
	else if(req.method == 'POST')
		handle_all_post(req, res,gameMaster);
	else
		method_not_allowed(req, res);
};

var server = http.createServer(requestHandler);
server.listen(PORT,function(){
	gameMaster = new lib.GameMaster([6],5,[1,2,3,4,5,6]);
	console.log('server is listen on ',PORT);
});


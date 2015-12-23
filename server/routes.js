var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var querystring = require('querystring');
var application = require('./application.js');
var operations = require('./operations.js');
var main = application.main;
var updates = operations.updates;
var enquiries = operations.enquiries;
var instructions = operations.instructions;
var getWinner = application.findWinner;

var headers = {
	".html" : "text/html",
	".svg"	: "image/svg+xml",
	".css"	: "text/css"
};

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};

var serveStaticFile = function(req, res, next){
	var filePath = './HTML' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.writeHead(200,{'content-type' : headers[path.extname(filePath)]});
			console.log(res.statusCode);
			res.end(data);
		}
		else
			next();
	});
};

var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(res.statusCode);
};

var doRedirect = function(req, res, next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	});
	req.on('end',function(){
		var userId = querystring.parse(data)['name'];
		if(application.enquiry({question:'players'}).length <= 3)
			createPlayer(userId, res);
		else 
			res.end('Please wait, a game is already started');
	});
};

var createPlayer = function(userId, res){
	if(!application.enquiry({question:'isValidPlayer',player:userId}))
		application.register(userId);
	// var color = application.findColor
	// var cookie = 'userId='+userId+'; color='+color;
	res.writeHead('301',{'Location':'/waitingPage.html',
		'content-type':'text/html',
		'Set-Cookie':'userId='+userId,

	});
	res.end();
};

var createInformation = function(req, res, next){
	// if(application.enquiry({question:'players'}).length < )

	var filePath = './HTML' + req.url;
	var userId = querystring.parse(req.headers.cookie).userId;
	// console.log('color in cookie is ', color);
	if(!userId || !application.enquiry({question:'isValidPlayer',player:userId})){
		res.writeHead('301',{'Location':'/index.html',
			'content-type':'text/html'
		});
		res.end();
	}
	else{
		var color = application.findColor(userId);
		fs.readFile(filePath, function(err, data){
			if(data){
				var replaceWith = userId + '\nYour coin color : '+color;
				var html = replaceRespectiveValue(data.toString(),'__userID__',replaceWith);
				res.responseCode = 200;
				res.end(html);
				console.log(res.responseCode);
			}
			else
				next();
		});	
	}
};

var replaceRespectiveValue = function(originalData,replaceFrom,replaceTo){
	return originalData.replace(replaceFrom,replaceTo);
};

var createWaitingPage = function(req, res, next){
	var filePath = './HTML' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			res.writeHead(200,{'content-type' : headers[path.extname(filePath)]});
			var userId = querystring.parse(req.headers.cookie).userId;
			var html = replaceRespectiveValue(data.toString(),'__userId__',userId);
			html = replaceRespectiveValue(html.toString(),'__numberOfPlayer__',application.enquiry({question:'players'}).length);
			res.end(html);
		}
		else
			next();
	});
};

var doInstruction = function(req, res, next){
	var obj = querystring.parse(req.url.slice(13));
	var player = querystring.parse(req.headers.cookie).userId;
	if(application.enquiry({question:'isValidPlayer',player:player})){
		obj.player = player;
		var result = application.handleInstruction(obj);
		res.end(result)
	}
	else
		next();
};

var handleUpdate = function(req, res, next){
	var obj = querystring.parse(req.url.slice(8));
	var player = querystring.parse(req.headers.cookie).userId;
	if(application.enquiry({question:'isValidPlayer',player:player})){
		obj.player = player;
		var result = application.handleUpdates(obj,res);
		res.end(result);
	}
	else
		next();
};

var handleEnquiry = function(req,res,next){
	var obj = querystring.parse(req.url.slice(9));
	var player = querystring.parse(req.headers.cookie).userId;
	if(application.enquiry({question:'isValidPlayer',player:player})){
		obj.player = player;
		var response = application.enquiry(obj);
		if(!response)
			next();
		else	
			res.end(response);
	}
	else
		next();
};

var createGameOverPage = function(req,res,next){
	var html = '<h2>Sorry Game Over</h2><h3>__userId__ won the game</h3>';
	html = replaceRespectiveValue(html,'__userId__',getWinner());
	res.end(html);
	// var filePath = './HTML' + req.url;
	// fs.readFile(filePath,function(err, data){
	// 	if(data){
	// 		// var html = data.replace('__userId__',getWinner());
	// 		res.end(html);
	// 	}
	// 	else
	// 		next();
	// });
}

exports.post_handlers = [
	{path: '^/index.html$', handler: doRedirect},
	{path: '^/$', handler: doRedirect},
	{path: '^/instruction', handler: doInstruction},
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path:'^/waitingPage.html$',handler:createWaitingPage},
	{path: '^/main.html$',handler:createInformation},
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '^/update', handler: handleUpdate},
	{path: '^/enquiry',handler: handleEnquiry},
	{path: '^/gameOver$', handler: createGameOverPage},
	{path: '', handler: fileNotFound}
];


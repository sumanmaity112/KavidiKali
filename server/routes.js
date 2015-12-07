var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var querystring = require('querystring');
var application = require('./application.js')
var main = application.main;

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
		if(application.enquiry('players').length <= 3)
			createPlayer(userId, res);
		else 
			res.end('Please wait, a game is already started');
	});
};

var createPlayer = function(userId, res){
	if(!application.enquiry('isValidPlayer',userId))
		application.register(userId);
	res.writeHead('301',{'Location':'/waitingPage.html',
		'content-type':'text/html',
		'Set-Cookie': 'userId='+userId 
	});
	res.end();
};

var createInformation = function(req, res, next){
	var filePath = './HTML' + req.url;
	var userId = querystring.parse(req.headers.cookie).userId;
	if(!userId || !application.enquiry('isValidPlayer',userId)){
		res.writeHead('301',{'Location':'/index.html',
			'content-type':'text/html'
		});
		res.end();
	}
	else{
		fs.readFile(filePath, function(err, data){
			if(data){
				var html = replaceRespectiveValue(data.toString(),'__userID__',userId);
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
			html = replaceRespectiveValue(html.toString(),'__numberOfPlayer__',application.enquiry('players').length);
			res.end(html);
		}
		else
			next();
	});
};

var doInstruction = function(req, res, next){
	var player = querystring.parse(req.headers.cookie).userId;
	if(application.enquiry('isValidPlayer',player)){
		var data = '';
		req.on('data',function(chunk){
			data += chunk;
		});
		req.on('end',function(){
			var obj = querystring.parse(data);
			obj.player = player;
			var result = application.handleInstruction(obj);
			res.end(result)
		});
	}
	else
		next();
};

var handleUpdate = function(req, res, next){
	var player = querystring.parse(req.headers.cookie).userId;
	if(application.enquiry('isValidPlayer',player)){
		var obj = querystring.parse(req.url.slice(8));
		obj.player = player;
		var result = application.handleUpdates(obj,res);
		res.end(result);
	}
	else
		next();
};

var handleEnquiry = function(req,res,next){
	var player = querystring.parse(req.headers.cookie).userId;
	if(application.enquiry('isValidPlayer',player)){
		var obj = querystring.parse(req.url.slice(9));
		res.end('players='+application.enquiry(obj.question,player));
	}
	else
		next();
};

exports.post_handlers = [
	{path: '^/index.html$', handler: doRedirect},
	{path: '^/$', handler: doRedirect},
	{path: '^/instruction$', handler: doInstruction},
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path:'^/waitingPage.html$',handler:createWaitingPage},
	{path: '^/main.html$',handler:createInformation},
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '^/update', handler: handleUpdate},
	{path: '^/enquiry',handler: handleEnquiry},
	{path: '', handler: fileNotFound}
];


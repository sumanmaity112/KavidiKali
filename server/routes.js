var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var querystring = require('querystring');
var main = require('./application.js').main;

var headers = {
	".html" : "text/html",
	".svg"	: "image/svg+xml",
	".css"	: "text/css"
};

var serveIndex = function(req, res, gameMaster, next){
	req.url = '/index.html';
	next();
};

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};

var serveStaticFile = function(req, res, gameMaster, next){
	var filePath = './HTML' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			console.log(req.url,"------\n");
			res.statusCode = 200;
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

var doRedirect = function(req, res, gameMaster, next ){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	});
	req.on('end',function(){
		var userId = querystring.parse(data)['name'];
		if(Object.keys(gameMaster.players).length <=3 )
			createPlayer(userId, res, gameMaster);
		else 
			res.end('Please wait, a game is already started');
	});
};

var createPlayer = function(userId, res, gameMaster){
	if(lodash.has(gameMaster.players,userId))
		res.writeHead('301',{'Location':'/main.html',
			'content-type':'text/html',
			'Set-Cookie': 'userId='+userId
		});
	else{
		gameMaster.createPlayer(userId);
		console.log('Current players are : ',Object.keys(gameMaster.players));
		res.writeHead('301',{'Location':'/waitingPage.html',
			'content-type':'text/html',
			'Set-Cookie': 'userId='+userId 
		});
	}
	res.end();
}

var createInformation = function(req, res, gameMaster, next){
	var filePath = './HTML' + req.url;
	var userId = querystring.parse(req.headers.cookie).userId;
	if(!userId || !lodash.has(gameMaster.players,userId)){
		res.writeHead('301',{'Location':'/index.html',
			'content-type':'text/html'
		});
		res.end();
	}
	else{
		fs.readFile(filePath, function(err, data){
			if(data){
				console.log(res.statusCode+'cookie :'+ req.headers.cookie);
				var html = replaceRespectiveValue(data.toString(),'__userID__',userId)
				res.end(html);
			}
			else
				next();
		});	
	}
};

var replaceRespectiveValue = function(originalData,replaceFrom,replaceTo){
	return originalData.replace(replaceFrom,replaceTo);
};

var createWaitingPage = function(req, res, gameMaster, next){
	var filePath = './HTML' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			console.log(req.url,"------>\n");
			res.statusCode = 200;
			res.writeHead(200,{'content-type' : headers[path.extname(filePath)]});
			var userId = querystring.parse(req.headers.cookie).userId;
			var html = replaceRespectiveValue(data.toString(),'__userId__',userId);
			html = replaceRespectiveValue(html.toString(),'__numberOfPlayer__',Object.keys(gameMaster.players).length);
			
			res.end(html);
		}
		else
			next();
	});
};

var rollDice = function(req, res, gameMaster, next){
	main('rollDice',req, res, gameMaster)
};

exports.post_handlers = [
	{path: '^/index.html$', handler: doRedirect},
	{path: '^/$', handler: doRedirect},
	{path: 'dice', handler: rollDice},
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path:'^/waitingPage.html$',handler:createWaitingPage},
	{path: '^/main.html$',handler:createInformation},
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: 'dice', handler: rollDice},
	{path: '', handler: fileNotFound}
];


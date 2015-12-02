var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var querystring = require('querystring');
var main = require('./application.js').main;

var headers = {
	".html" : "text/html",
	".svg"	: "image/svg+xml",
	".css"	: "text/css"
}
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
			console.log(req.url,"------\n",data);
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
		if(Object.keys(gameMaster.players).length>4)
			res.end('Please wait, a game is already started');
		else 
			createPlayer(userId, res, gameMaster);
	});
};

var createPlayer = function(userId, res, gameMaster){
	if(lodash.has(gameMaster.players,userId))
		res.writeHead('301',{'Location':'/index.html',
			'content-type':'text/html',
			'Set-Cookie': 'userId='+undefined 
		});
	else{
		gameMaster.createPlayer(userId);
		res.writeHead('301',{'Location':'/main.html',
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
				var html = data.toString().replace('__userID__',userId);
				res.end(html);
			}
			else
				next();
		});	
	}
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
	{path: '^/main.html$',handler:createInformation},
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: 'dice', handler: rollDice},
	{path: '', handler: fileNotFound}
];


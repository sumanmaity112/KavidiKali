var fs = require('fs');
var querystring = require('querystring');

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
			res.statusCode = 200;
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
	})
	req.on('end',function(){
		var userId = req.connection.remoteAddress+'_' + querystring.parse(data)['name'];
		gameMaster.createPlayer(userId);
		res.writeHead('301',{'Location':'/main.html',
			'content-type':'text/html'
		});
		res.end();
	})
	
};

var createInformation = function(req, res, gameMaster, next){
	var filePath = './HTML' + req.url;
	var userId = Object.keys(gameMaster.players)[Object.keys(gameMaster.players).length - 1];
	fs.readFile(filePath, function(err, data){
		if(data){
			console.log(res.statusCode);
			var html = data.toString().replace('__userID__',userId.split('_')[1]);
			res.end(html);
		}
		else{
			next();
		}
	});
};

var rollDice = function(req, res, gameMaster, next){
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		var obj = JSON.parse(data);
		var userId = req.connection.remoteAddress+'_' +obj.player.trim()
		var player = gameMaster.players[userId];
		var diceValue = player.rollDice(gameMaster.dice);
		console.log(diceValue);
		res.statusCode = 200;
		res.end('diceValues='+diceValue);
	});
};

exports.post_handlers = [
	{path: '^/$', handler: doRedirect},
	{path: 'dice', handler: rollDice},
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path: '^/main.html$',handler:createInformation},
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '^/\\?name=', handler: doRedirect},
	{path: 'dice', handler: rollDice},
	{path: '', handler: fileNotFound}
];


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
		else{
			next();
		}
	});
};

var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(res.statusCode);
};
var doRedirect = function(req, res, gameMaster, next ){
	var userId = req.connection.remoteAddress+'_' + querystring.parse(req.url)['/?name'];
	gameMaster.createPlayer(userId);
	var filePath = './HTML/main.html';
	res.statusCode = 302;
	res.url = '/main.html'
	createInformation(filePath, res, next,userId);
};

var createInformation = function(filePath,res,next,userId){
	fs.readFile(filePath, function(err, data){
		if(data){
			console.log(res.statusCode);
			var html = data.toString().replace('__userID__',userId)
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
		var player = gameMaster.players[obj.player.trim()]
		var diceValue = player.rollDice(gameMaster.dice);
		console.log(diceValue);
		res.end('diceValues='+diceValue);
	});
};

exports.post_handlers = [
	{path: 'dice', handler: rollDice},
	{path: '', handler: method_not_allowed}
];

exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '^/\\?name=', handler: doRedirect},
	{path: 'dice', handler: rollDice},
	{path: '', handler: fileNotFound}
];

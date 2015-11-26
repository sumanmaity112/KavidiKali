var fs = require('fs');
var querystring = require('querystring');

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};

var serveStaticFile = function(req, res, next){
	var filePath = './HTML' + req.url;
	createInformation(filePath, res, next);
};

var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
	console.log(res.statusCode);
};
var doRedirect = function(req, res, next, gameMaster){
	var userId = req.connection.remoteAddress+'_' + querystring.parse(req.url)['/?name'];
	gameMaster.createPlayer(userId);
	var filePath = './HTML/main.html';
	res.statusCode = 302;
	res.url = '/main.html'
	createInformation(filePath, res, next);
};

var createInformation = function(filePath,res,next){
	fs.readFile(filePath, function(err, data){
		if(data){
			console.log(res.statusCode);
			res.end(data);
		}
		else{
			next();
		}
	});
}

exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '^/\\?name=', handler: doRedirect},
	{path: '', handler: fileNotFound},
];

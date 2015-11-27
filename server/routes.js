var fs = require('fs');
var querystring = require('querystring');

var serveIndex = function(req, res, next){
	req.url = '/index.html';
	next();
};

var serveStaticFile = function(req, res, next){
	var filePath = './HTML' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
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
var doRedirect = function(req, res, next, gameMaster){
	var userId = req.connection.remoteAddress+'_' + querystring.parse(req.url)['/?name'];
	gameMaster.createPlayer(userId);
	res.writeHead('301',{'Location':'/main.html',
		'content-type':'text/html'
	});
	res.end();
};

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	// console.log(res.statusCode);
	res.end('Method is not allowed');
};

exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '^/\\?name=', handler: doRedirect},
	{path: '', handler: fileNotFound},
];

exports.post_handlers = [
	{path: '^/$', handler: doRedirect},
	{path: '', handler: method_not_allowed}
];


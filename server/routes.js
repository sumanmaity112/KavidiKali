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

exports.get_handlers = [
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];

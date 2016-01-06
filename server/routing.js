var app = require('./routes.js');

var requestHandler = function(games){
	return function(req, res){
		console.log(req.method, req.url, req.headers.cookie);
		req.games = games;
		app(req, res);
	}
};

module.exports = requestHandler;
var app = require('./routes.js');

var requestHandler = function(games){
	return function(req, res){
		req.games = games;
		app(req, res);
	}
};

module.exports = requestHandler;

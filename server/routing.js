var app = require('./routes.js');

var requestHandler = function(game){
	return function(req, res){
		console.log(req.method, req.url, req.headers.cookie);
		req.game = game;
		app(req,res);
	}
};

module.exports = requestHandler;
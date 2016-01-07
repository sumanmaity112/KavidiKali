var chance = new require('chance')();
var Game = require('./../javascript/sourceCode/game.js');
var lodash = require('lodash');

var createGame = function(games){
	var gameId = chance.string({length: 9});
	games[gameId] = new Game([6],5,[1,2,3,4,5,6]);
};

var findRecentGameId = function(games){
	return lodash.last(Object.keys(games));
};

var findNoOfJoinedPlayer = function(games){
	var recentGame = games[findRecentGameId(games)];
	return Object.keys(recentGame.players).length;
};
var isValidCookie = function(req){
	var cookieGameId = req.cookies.gameId;
	return cookieGameId && lodash.has(req.games,cookieGameId);
};
var chooseGame = function(req){
	var recentGameId = findRecentGameId(req.games);
	var recentGame = req.games[recentGameId];
	if(!isValidCookie(req)){
		req.game = recentGame;
		req.tempGameId = recentGameId;
	}
	else{
		var gameId = req.cookies.gameId;
		req.game = req.games[gameId];
	}
}

exports.loadGame = function(req, res, next){
	var gamesId = Object.keys(req.games);
	var cookieGameId = req.cookies.gameId;
	if((gamesId.length==0 || findNoOfJoinedPlayer(req.games)==4)&& !isValidCookie(req))
		createGame(req.games);
	chooseGame(req);
	next();
};

exports.removeGame = function(gameId){
	games = lodash.omit(games,gameId);
};

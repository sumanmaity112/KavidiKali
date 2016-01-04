var games={};
var chance = new require('chance')();
var Game = require('./../javascript/sourceCode/game.js');
var lodash = require('lodash');

var createGame = function(){
	var gameId = chance.string({length: 9});
	games[gameId] = new Game([6],5,[1,2,3,4,5,6]);
};

var findRecentGameId = function(){
	return lodash.last(Object.keys(games));
};

var findNoOfJoinedPlayer = function(){
	var recentGame = games[findRecentGameId()]; 
	return Object.keys(recentGame.players).length;
};

var chooseGame = function(req){
	var recentGameId = findRecentGameId();
	var recentGame = games[recentGameId]; 
	var cookieGameId = req.cookies.gameId;
	if(!cookieGameId || !lodash.has(games,cookieGameId)){
		req.game = recentGame;
		req.tempGameId = recentGameId;
	}
	else{
		var gameId = req.cookies.gameId;
		req.game = games[gameId];
	}
}

exports.loadGame = function(req, res, next){
	if(!req.game){
		var gamesId = Object.keys(games);
		if(gamesId.length==0 || findNoOfJoinedPlayer()==4)
			createGame();
		chooseGame(req);
	}
	next();
};

exports.removeGame = function(gameId){
	games = lodash.omit(games,gameId);
};

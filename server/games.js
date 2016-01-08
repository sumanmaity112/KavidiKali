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
var isValidGame = function(games, gameId){
	return gameId && lodash.has(games,gameId);
};
var chooseGame = function(games, gameId){
	var recentGameId = findRecentGameId(games);
	var recentGame = games[recentGameId];
	if(!isValidGame(games, gameId)){
		recentGame.id = recentGameId;
		return recentGame;
	}
	else
		return games[gameId];
}

exports.loadGame = function(games, gameId){
	var listOfGames = Object.keys(games);
	if((listOfGames.length==0 || findNoOfJoinedPlayer(games)==4)&& !isValidGame(games, gameId))
		createGame(games);
	return chooseGame(games, gameId);
};

exports.removeGame = function(gameId){
	games = lodash.omit(games,gameId);
};

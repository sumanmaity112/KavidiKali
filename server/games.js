var chance = new require('chance')();
var Game = require('./../javascript/sourceCode/game.js');
var lodash = require('lodash');
const ID_LENGTH = 6;
const POSSIBLE_ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

var createGame = function(games){
	var gameId = chance.string({length:ID_LENGTH,pool:POSSIBLE_ID_CHARACTERS});
	games[gameId] = new Game(gameId);
	return gameId;
};

var findRecentGameId = function(games){
	return lodash.last(Object.keys(games));
};
var isValidGame = function(games, gameId){
	return gameId && lodash.has(games,gameId);
};
var findNoOfPlayer=function(game){
	return Object.keys(game.players).length;
}
var chooseGame = function(games, gameId){
	var recentGameId = findRecentGameId(games);
	var recentGame = games[recentGameId];
	if(!isValidGame(games, gameId))
		return recentGame;
	else
		return games[gameId];
};
var findGame = function(games,gameId){
	if(!games[gameId]|| (games[gameId]&&findNoOfPlayer(games[gameId])==4)){
		createGame(games);
		gameId=undefined;
	}
	return chooseGame(games,gameId);
};
exports.removeGame = function(games){
	var unwantedGames=[];
	for(var id in games){
		if(games[id].readyToRemove)
			unwantedGames.push(id);
	}
	unwantedGames.forEach(function(id){games = lodash.omit(games,id)});
	return games;
}
exports.loadGame = function(games, gameId, data,url){
	if((data.option=='joinGame' && url=='/login')||(url=='/isValidDetails')){
		return findGame(games,data.gameId);
	}
	if(Object.keys(games).length==0 || data.option=='newGame'){
		gameId = createGame(games);
	}
	return chooseGame(games,gameId);
};

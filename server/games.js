var chance = new require('chance')();
var Game = require('./../javascript/sourceCode/game.js');
var lodash = require('lodash');
const ID_LENGTH = 6;
const POSSIBLE_ID_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

var createGame = function(games, playerSize){
	var gameId = chance.string({length:ID_LENGTH,pool:POSSIBLE_ID_CHARACTERS});
	games[gameId] = new Game(gameId, playerSize);
	return gameId;
};

exports.removeGame = function(games){
	var unwantedGames=[];
	for(var id in games){
		if(games[id].readyToRemove)
			unwantedGames.push(id);
	}
	unwantedGames.forEach(function(id){games = lodash.omit(games,id)});
	return games;
};

exports.loadGame = function(games, gameId, data,url){
	if(data.option=='joinGame' && url=='/login'){
		return games[data.gameId];
	}
	if(Object.keys(games).length==0 || data.option=='newGame'){
		gameId = createGame(games, data.numberOfPlayers);
	}
	return games[gameId]
};

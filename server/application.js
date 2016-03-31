var lodash = require('lodash');
var operations = require('./operations.js');
var actions = operations.actions;
var updates = operations.updates;
var enquiries = operations.enquiries;

exports.handleInstruction = function(obj,gameMaster){
	if(obj.player == gameMaster.currentPlayer)
		return actions[obj.action](gameMaster, obj);
	return 'Wrong Player';
};

exports.handleUpdates = function(obj,gameMaster){
	var updater = updates[obj.toUpdate];
	return updater(gameMaster,obj);
};

exports.enquiry = function(obj,gameMaster){
	var enquiry = enquiries[obj.question];
	return enquiry && enquiry(gameMaster,obj);
};

exports.register = function(name,gameMaster){
	if(lodash.has(gameMaster.players,name) || gameMaster.isFull())
		return false;
	gameMaster.createPlayer(name);
	var obj = {question:'players'};
	JSON.parse(exports.enquiry(obj,gameMaster)).length == 1 && gameMaster.players[name].chances++;
	return true;
};

exports.availableGame = function(games){
	var result = [];
	Object.keys(games).forEach(function(game){
		var gameObj = {gameId:game};
		var players = Object.keys(games[game].players)
        gameObj.value = games[game].numberOfPlayers;
		if(!games[game].isFull()){
			result.push(gameObj);
		};
	});
	return JSON.stringify(result);
};

exports.newGames = function(games) {
    var result = [];
    result.push({value:2,withBot:false});
    result.push({value:3,withBot:false});
    result.push({value:4,withBot:false});
    result.push({value:2,withBot:true});
    result.push({value:3,withBot:true});
    result.push({value:4,withBot:true});
    return JSON.stringify(result);
}

exports.isGameReady = function(game){
	console.log("======================",game.isFull())
	return game.isFull();
}

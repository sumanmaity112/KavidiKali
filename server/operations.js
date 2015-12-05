var lodash = require('lodash');
var queryString = require('querystring');


var rollDice = function(player,gameMaster){
	var diceValue = gameMaster.players[player].rollDice(gameMaster.dice);
	gameMaster.setChances(diceValue,player);
	return 'diceValue'+diceValue;
};

exports.actions = {
	rollDice: rollDice
};

//========================================================================================================

var getAllDiceValues = function(gameMaster, player){
	return 'diceValues='+gameMaster.players[player].diceValues;
};

var refreshBoard = function(gameMaster){
	var obj = {};
	Object.keys(gameMaster.players).forEach(function(player){
		Object.keys(gameMaster.players[player].coins).forEach(function(coin){
			obj[coin] = gameMaster.players[player].coins[coin].currentPosition;
		});
	});
	return queryString.stringify(obj);
}

exports.updates = {
	diceValues : getAllDiceValues,
	board : refreshBoard
};

//========================================================================================================

exports.enquiries = [
	{enquiry:'isValidPlayer', action : function(gameMaster,player){ return lodash.has(gameMaster.players,player)}},
	{enquiry:'currentPlayer', action : function(gameMaster){ return gameMaster.getCurrentPlayer();}},
	{enquiry:'players', action : function(gameMaster){ return Object.keys(gameMaster.players);}}
];

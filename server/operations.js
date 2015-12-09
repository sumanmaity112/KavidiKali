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
	var stateOfGame=gameMaster.stateOfGame();
	return JSON.stringify(stateOfGame);
};

var updateWaitingPage = function(gameMaster,player){
	if(Object.keys(gameMaster.players).length==4)
		return false;
	else
		return (Object.keys(gameMaster.players).length).toString();
}

exports.updates = {
	diceValues : getAllDiceValues,
	board : refreshBoard,
	waitingPage : updateWaitingPage
};

//========================================================================================================

exports.enquiries = [
	{enquiry:'isValidPlayer', action : function(gameMaster,player){ return lodash.has(gameMaster.players,player)}},
	{enquiry:'currentPlayer', action : function(gameMaster){ return gameMaster.getCurrentPlayer();}},
	{enquiry:'players', action : function(gameMaster){ return Object.keys(gameMaster.players);}}
];

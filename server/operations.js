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

var updateWaitingPage = function(gameMaster,obj){
	// if(Object.keys(gameMaster.players).length==4)
	// 	return false;
	// else
		return (Object.keys(gameMaster.players).length).toString();
}

exports.updates = {
	diceValues : getAllDiceValues,
	board : refreshBoard,
	waitingPage : updateWaitingPage
};

//========================================================================================================

exports.enquiries = [
	{enquiry:'isValidPlayer', action : function(gameMaster,obj){ return lodash.has(gameMaster.players,obj.player)}},
	{enquiry:'currentPlayer', action : function(gameMaster){ return gameMaster.getCurrentPlayer();}},
	{enquiry:'players', action : function(gameMaster){ return Object.keys(gameMaster.players);}},
	{enquiry:'isItMyChance', action : function(gameMaster,obj){return gameMaster.currentPlayer == obj.player && 'true';}},
];

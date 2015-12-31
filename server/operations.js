var lodash = require('lodash');
var queryString = require('querystring');


var rollDice = function(gameMaster, obj){
	var player = gameMaster.players[obj.player];
	var diceValue = player.chances>0 && player.rollDice(gameMaster.dice);
	gameMaster.setChances(diceValue,player.id) || gameMaster.nextPlayer();
	return 'diceValue'+diceValue;
};

var moveCoin = function(gameMaster, obj){
	var player = gameMaster.players[obj.player];
	player.moveCoin(obj.coin,obj.position);
	gameMaster.anyMoreMoves(obj.player) || gameMaster.nextPlayer();
};

exports.actions = {
	rollDice: rollDice,
	moveCoin: moveCoin
};

//========================================================================================================

var getAllDiceValues = function(gameMaster, obj){
	return 'diceValues='+gameMaster.players[obj.player].diceValues;
};

var refreshBoard = function(gameMaster){
	var stateOfGame=gameMaster.stateOfGame();
	return JSON.stringify(stateOfGame);
};

var updateWaitingPage = function(gameMaster,obj){
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

var movesTo = function(gameMaster, obj){
	var player = gameMaster.players[obj.player];
	var coin = player.coins[obj.coin];
	var moves = gameMaster.getAllValidMovesOfCoin(coin,player.diceValues,player.path);
	var temp = JSON.stringify(moves);
	return temp;
};

var moreChanceToRollDice = function(gameMaster, obj){
	var currPlayer = gameMaster.currentPlayer;
	var chances = gameMaster.players[currPlayer].chances;
	if(currPlayer==obj.player && chances>0)
		return 'true';
	return 'false';
};

var checkStatus = function(gameMaster){
	var status =  Object.keys(gameMaster.players).some(function(player){
		return gameMaster.players[player].isWin;
	});
	return status.toString();
};

var myNameAndColor = function(gameMaster, obj){
	var color = gameMaster.players[obj.player].coinColor
	return obj.player + '\nYour coin color : '+color;
};

var resetGame = function(){
	var succefullySendRes = 0;
	return function(gameMaster){
		succefullySendRes++;
		if(succefullySendRes==4)
			gameMaster.reset();
	};
}();

exports.enquiries = {
	'isValidPlayer'		: function(gameMaster,obj){ return lodash.has(gameMaster.players,obj.player)},
	'currentPlayer'		: function(gameMaster){ return gameMaster.currentPlayer;},
	'players' 			: function(gameMaster){ return Object.keys(gameMaster.players);},
	'isItMyChance' 		: function(gameMaster,obj){return gameMaster.currentPlayer == obj.player && 'true';},
	'moreChanceToRollDice' : moreChanceToRollDice,
	'isAllPlayersJoined': function(gameMaster){return Object.keys(gameMaster.players).length==4},
	'doHaveMoves' 		: function(gameMaster,obj){ return gameMaster.anyMoreMoves(obj.player).toString();},
	'movesWhere' 		: movesTo,
	'isGameOver'		: checkStatus,
	'whatIsMyName'		: function(gameMaster, obj){ return obj.player},
	'myNameAndColor'	: myNameAndColor,
	'whoIsTheWinner'	: function(gameMaster){ gameMaster.winner && resetGame(gameMaster); return gameMaster.winner}
};

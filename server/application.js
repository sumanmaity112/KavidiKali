var lodash = require('lodash');
var operations = require('./operations.js');
var actions = operations.actions;
var updates = operations.updates;
var enquiries = operations.enquiries;
var game = require('./../javascript/sourceCode/game.js').game;

var gameMaster = new game([6],5,[1,2,3,4,5,6]);

exports.handleInstruction = function(obj){
	if(obj.player == gameMaster.currentPlayer)
		return actions[obj.action](gameMaster, obj);
	return 'Wrong Player';
};

exports.handleUpdates = function(obj){
	var updater = updates[obj.toUpdate];
	var update = updater(gameMaster,obj);
	return update;
};

exports.enquiry = function(obj){
	var enquiry = lodash.findWhere(enquiries,{enquiry:obj.question});
	return enquiry && enquiry.action(gameMaster,obj);
};

exports.register = function(name){
	gameMaster.createPlayer(name);
	var obj = {question:'players'};
	exports.enquiry(obj).length == 1 && gameMaster.players[name].chances++;
};

exports.findColor=function(userId){
	return gameMaster.players[userId].coinColor;
};

exports.findWinner=function(){
	var winner = gameMaster.winner;
	resetGame(gameMaster);
	return winner;
};

var resetGame = function(){
	var succefullySendRes = 0;
	return function(gameMaster){
		succefullySendRes++;
		if(succefullySendRes==4)
			gameMaster.reset();
	};
}();

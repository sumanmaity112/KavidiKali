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

exports.isValidName = function(gameMaster,name){
	return !lodash.has(gameMaster.players,name);
}

exports.enquiry = function(obj,gameMaster){
	var enquiry = enquiries[obj.question];
	return enquiry && enquiry(gameMaster,obj);
};

exports.register = function(name,gameMaster){
	if(lodash.has(gameMaster.players,name)){
		console.log('__________ DUPLICATE PLAYER');
		return false;
	}
	gameMaster.createPlayer(name);
	var obj = {question:'players'};
	exports.enquiry(obj,gameMaster).length == 1 && gameMaster.players[name].chances++;
	return true;
};

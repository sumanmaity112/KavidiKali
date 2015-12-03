var lodash = require('lodash');
var operations = require('./operations.js');
var actions = operations.actions;
var updates = operations.updates;
var enquiries = operations.enquiries;
var lib = require('./../javascript/sourceCode/kavidiKaliLib.js');
var	gameMaster = new lib.entities.GameMaster([6],5,[1,2,3,4,5,6]);


exports.handleInstruction = function(obj){
	if(obj.player == gameMaster.getCurrentPlayer().id)
		return actions[obj.action](obj.player,gameMaster);
	return 'Wrong Player';
};

exports.handleUpdates = function(obj){
	var update = updates[obj.toUpdate];
	return update(gameMaster,obj.player);
};

exports.enquiry = function(question,player){
	var action = lodash.findWhere(enquiries,{enquiry:question})['action'];
	return action(gameMaster,player);
};

exports.register = function(name){
	gameMaster.createPlayer(name);
};

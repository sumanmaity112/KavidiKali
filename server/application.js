var lodash = require('lodash');
var operations = require('./operations.js');
var actions = operations.actions;
var updates = operations.updates;
var enquiries = operations.enquiries;


exports.handleInstruction = function(obj, gameMaster){
	if(obj.player == gameMaster.getCurrentPlayer().id)
		return actions[obj.action](obj.player,gameMaster);
	return 'Wrong Player';
};

exports.handleUpdates = function(obj, gameMaster){
	var update = updates[obj.toUpdate];
	return update(gameMaster,obj.player);
};

exports.enquiry = function(question,gameMaster,player){
	var action = lodash.findWhere(enquiries,{enquiry:question})['action'];
	return action(gameMaster,player);
};


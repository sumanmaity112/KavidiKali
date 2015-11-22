var lodash = require('lodash');
var entities = {};
exports.entities = entities;

entities.Board = function(safePlaces,size){
	this.grid = lodash.fill(new Array(size),new Array(size));
	this.safePlaces = safePlaces;
};

entities.Board.prototype.isSafe = function(coin){
	return this.safePlaces.indexOf(coin.currentPosition)>=0;
}

entities.Coin = function(){

};

entities.Player = function(){

};

entities.Dice = function(){

};

entities.GameMaster = function(){

};

entities.SafePlaces = function(){
	
};

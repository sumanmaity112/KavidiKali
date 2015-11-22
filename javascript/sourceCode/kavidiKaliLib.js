var lodash = require('lodash');
var entities = {};
exports.entities = entities;

entities.Board = function(safePlaces,size){
	this.grid = lodash.fill(new Array(size),new Array(size));
	this.safePlaces = safePlaces;
};

entities.Board.prototype.isSafe = function(coin){
	return (lodash.findIndex(this.safePlaces,coin.currentPosition)>=0);
};

entities.Coin = function(){

};

entities.Player = function(){

};

entities.Dice = function(values){
	this.values = values;
};

entities.Dice.prototype = {
	roll : function(){
		var randomNumber = lodash.random(0,this.values.length-1);
		return this.values[randomNumber];
	}
}

entities.GameMaster = function(){

};

entities.createSafePlaces = function(size){
	var safePlaces = [];
	safePlaces.push([0,Math.floor(size/2)]);
	safePlaces.push([Math.floor(size/2),size-1]);
	safePlaces.push([size-1,Math.floor(size/2)]);
	safePlaces.push([Math.floor(size/2),0]);
	safePlaces.push([Math.floor(size/2),Math.floor(size/2)]);
	return safePlaces;
};


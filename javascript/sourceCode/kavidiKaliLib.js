var lodash = require('lodash');
var entities = {};
exports.entities = entities;

entities.Board = function(){

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

entities.SafePlaces = function(){

}
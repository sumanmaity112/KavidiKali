var lodash = require('lodash');
var entities = {};
exports.entities = entities;
//===========================================================================
entities.Board = function(safePlaces,size){
	this.grid = createGrid(safePlaces,size);
	this.safePlaces = safePlaces;
};
entities.Board.prototype={
	isSafe : function(coin){
		return (lodash.indexOf(this.safePlaces,coin.currentPosition)>=0);
	},
	isThereAnyCoin : function(position){
		return this.grid[position];
	}
};

var createGrid = function(safePlaces,size){
	var grid = {};
	for(var row = 0;row < size;row++)
		for(var column = 0;column < size;column++)
			grid[row+','+column] = undefined;
	safePlaces.forEach(function(safePlace){
		grid[safePlace] = [];
	});
	return grid;
};

entities.Coin = function(id){
	this.id = id;
	this.currentPosition = undefined;
	this.reachedHome = false;
};

entities.Coin.prototype = {
	move : function(movesTo){
		this.currentPosition = movesTo;
	},

	die : function(){
		this.currentPosition = undefined;
	},

	hasReachedHome : function(){
		this.reachedHome = true;
	}
};

entities.Player = function(id){
	this.id = id;
	this.matured = false;
	this.coins = createCoins(id,4);
	this.diceValues = new Array;
};

var createCoins =  function(id,numberOfCoins){
	var coins = new Object;
	for(var i=1; i<=numberOfCoins; i++){
		coins[id+i] = new entities.Coin(id+i);
	};
	return coins;
};

entities.Player.prototype = {
	rollDice : function(dice){
		var diceValue = dice.roll();
		this.diceValues.push(diceValue);
		return diceValue;
	},
	moveCoin : function(coinID,movesTo){
		var coin = this.coins[coinID];
		coin.move(movesTo);
	},
	kill : function(coin){
		coin.die();
		this.matured = true;
	}
};

entities.Dice = function(values){
	this.values = values;
};

entities.Dice.prototype = {
	roll : function(){
		var randomIndex = lodash.random(0,this.values.length-1);
		return this.values[randomIndex];
	}
}

entities.GameMaster = function(){
	this.players = {};
};

entities.GameMaster.prototype = {
	analyzeDiceValue : function(diceValue, specialValue){
		return diceValue == specialValue;
	},
	createPlayer : function(playerId){
		this.players[playerId] = new entities.Player(playerId);
	}
}

entities.createSafePlaces = function(size){
	var safePlaces = [];
	safePlaces.push([0,Math.floor(size/2)]);
	safePlaces.push([Math.floor(size/2),size-1]);
	safePlaces.push([size-1,Math.floor(size/2)]);
	safePlaces.push([Math.floor(size/2),0]);
	safePlaces.push([Math.floor(size/2),Math.floor(size/2)]);
	safePlaces.forEach(function(safePlace,index){
		return safePlaces[index] = safePlace.join();
	});
	return safePlaces;
};

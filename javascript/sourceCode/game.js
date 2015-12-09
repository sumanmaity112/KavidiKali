var lib = require('./tile.js');
var tiles = lib.tile;
var generateSafePositions = lib.generateSafePositions;
var pathLib = require('./generatePath.js');
var dice = require('./dice.js').dice;
var player = require('./player.js').player;
var Coin = require('./coin.js').coin;

var Game = function(specialValues,size,diceValues){
	this.safePositions = generateSafePositions(size);
	this.players = {};
	this.specialValues = specialValues;
	this.tiles = tiles.generateTiles(size);
	this.dice = new dice(diceValues);
	this.getCurrentPlayer = getCurrentPlayer(this);
	
};

Game.prototype = {
	analyzeDiceValue : function(diceValue){
		return (this.specialValues.indexOf(diceValue)>=0);
	},
	createPlayer : function(playerId){
		var playersCount = Object.keys(this.players).length;
		var colorSequence=["red","green","blue","yellow"];
		var startingPosition = this.safePositions[playersCount];
		var tiles = this.tiles;
		var path = pathLib.generateHalfPath(startingPosition).map(function(pos){
			return tiles[pos];
		});
		var coins = createCoins(playerId,4,colorSequence[playersCount]);
		this.players[playerId] = new player(playerId, path, coins);
	},
	setChances : function(diceValue,playerId){
		if(this.analyzeDiceValue(diceValue))
			this.players[playerId].chances++;  
	},
	isPlayerMatured : function(player){
		return player.matured;
	},
	stateOfGame: function() {
		var state={};
		var players=this.players;
		for (var player in players) {
			var coins=players[player].coins
			for (var coin in coins) {
				state[coin]=coins[coin];
			}
		}
		return state;
	},
	get currentPlayer(){
		var players = this.players;
		var currPlayer;
		Object.keys(players).forEach(function(player){
			if(players[player].chances)
				currPlayer = players[player]
		});
		return currPlayer.id;
	}
};

var getCurrentPlayer = function(master){
	var counter = 0;
	return (function(){
		var players = Object.keys(this.players);
		var currPlayer = this.players[players[counter]]
		if(!currPlayer.chances){
			counter = (counter+1)%players.length;
			this.players[players[counter]].chances++;
	 	};	
		return this.players[players[counter]];
	}).bind(master);
};


var createCoins =  function(id,numberOfCoins,colour){
	var coins = new Object;
	for(var count=1; count<=numberOfCoins; count++){
		coins[id+count] = new Coin(id+count,colour);
	}
	return coins;
};

exports.game = Game;
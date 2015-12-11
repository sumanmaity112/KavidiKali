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
	this.nextPlayer = nextPlayer(this);
};

Game.prototype = {
	analyzeDiceValue : function(diceValue){
		return (this.specialValues.indexOf(diceValue)>=0);
	},
	createPlayer : function(playerId){
		var playersCount = Object.keys(this.players).length;
		var colorSequence=["red","green","blue","yellow"];
		var startingPosition = this.safePositions[playersCount];
		var path = createPath(startingPosition,this.tiles,pathLib.generateHalfPath);
		var coins = createCoins(playerId,4,colorSequence[playersCount]);
		this.players[playerId] = new player(playerId, path, coins,extendedPath);
	},
	setChances : function(diceValue,playerId){
		if(this.analyzeDiceValue(diceValue)){
			this.players[playerId].chances++;
			return true;  
		}
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

var createPath = function(startingPosition,tiles,operationName){
	return operationName(startingPosition).map(function(pos){
			return tiles[pos];
		});
};

var nextPlayer = function(master){
	var counter = 0;
	return (function(){
		var players = Object.keys(this.players);
		counter = (counter+1)%players.length;
		this.players[players[counter]].chances++;
		return this.players[players[counter]].id;
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
var lib = require('./tile.js');
var tiles = lib.tile;
var generateSafePositions = lib.generateSafePositions;
var pathLib = require('./generatePath.js');
var dice = require('./dice.js').dice;
var player = require('./player.js').player;
var coin = require('./coin.js').coin;

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
		var yardSequence = ["2,-1",'5,2','2,5','-1,2'];
		var path = {}, tiles = this.tiles;
		pathLib.generateHalfPath(this.safePositions[playersCount]).forEach(function(id){
			path[id] = tiles[id];
		});
		path['-1']=yardSequence[playersCount];
		var coins = createCoins(playerId,4,colorSequence[playersCount],path['-1']);
		this.players[playerId] = new player(playerId,path,coins);
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
		for (player in players) {
			var coins=players[player].coins
			for (coin in coins) {
				state[coin]=coins[coin];
			}
		}
		return state;
	}
};

var createCoins =  function(id,numberOfCoins,colour,defaultCurrentPos){
	var coins = new Object;
	for(var count=1; count<=numberOfCoins; count++){
		coins[id+count] = new coin(id+count,colour,defaultCurrentPos);
	}
	return coins;
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
exports.game = Game;